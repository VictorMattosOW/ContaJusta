# Plano de Refatoração — `OrderComponent`

historico do opencode opencode -s ses_0548b85d0ffedS9Um96aKb6lo8

## Sumário

1. [Extração de lógica CRUD para serviço (SRP)](#1-extração-de-lógica-crud-para-serviço-srp)
2. [Corrigir fluxo de dados em `createOrder()`](#2-corrigir-fluxo-de-dados-em-createorder)
3. [Quebrar dependência do `SessionService` (DIP/ISP)](#3-quebrar-dependência-do-sessionservice-dipisp)
4. [Migrar estado restante para signals](#4-migrar-estado-restante-para-signals)
5. [Remover código morto e comentado](#5-remover-código-morto-e-comentado)
6. [Gerar IDs com `crypto.randomUUID()`](#6-gerar-ids-com-cryptorandomuuid)
7. [Extrair navegação para serviço](#7-extrair-navegação-para-serviço)

---

## 1. Extração de lógica CRUD para serviço (SRP)

### Onde está hoje

```typescript
// order.component.ts — linhas 163-175
createOrder() {
  this.orderForm.submitOrder();
  const order: Order = {
    id: `${this.order.foodName} + ${Date.now()}`,
    name: this.order.foodName,
    price: this.order.price,
    quantity: this.order.quantity,
    sharedUsers: this.sharedFood
  };
  this.orders = [...this.orders, order];
  this.resetCheckbox.update(v => v + 1);
}
```

```typescript
// order.component.ts — linhas 196-199
deleteItem(orderToDelete: Order) {
  this.orders = this.orders.filter((order) => order.id !== orderToDelete.id);
  this.saveOrders();
}
```

### Por que mudar

**Single Responsibility Principle (SRP):** O componente hoje acumula:

- Gerenciamento de estado local (orders, users, form)
- Regras de negócio (criar, editar, deletar pedidos)
- Mapeamento dados (id → User)
- Navegação (rotas)
- Persistência (`SessionService`)

Isso dificulta:

- **Testar** — cada teste precisa montar o componente inteiro com rotas, forms, etc.
- **Reusar** — a lógica de criação de pedido não pode ser usada por outro componente
- **Manter** — uma mudança em como o pedido é criado exige alterar o componente

### Como fazer

1. Transformar o `OrderService` existente em `features/order/services/order.service.ts` em um serviço focado em operações de domínio:

```typescript
// features/order/services/order.service.ts
@Injectable({ providedIn: 'root' })
export class OrderService {
  private orders = signal<Order[]>([]);

  readonly orders$ = this.orders.asReadonly();

  addOrder(data: OrderFormData, sharedUsers: User[]): Order {
    const order: Order = {
      id: crypto.randomUUID(),
      name: data.foodName,
      price: data.price,
      quantity: data.quantity,
      sharedUsers
    };
    this.orders.update((list) => [...list, order]);
    return order;
  }

  removeOrder(id: string): void {
    this.orders.update((list) => list.filter((o) => o.id !== id));
  }

  updateOrder(id: string, data: Partial<Order>): void {
    this.orders.update((list) => list.map((o) => (o.id === id ? { ...o, ...data } : o)));
  }

  clearOrders(): void {
    this.orders.set([]);
  }
}
```

2. O componente passa a chamar apenas o serviço:

```typescript
createOrder() {
  this.orderService.addOrder(this.order, this.sharedFood);
  this.resetCheckbox.update(v => v + 1);
}
```

---

## 2. Corrigir fluxo de dados em `createOrder()`

### Onde está hoje

O `createOrder()` usa **dois canais concorrentes** pra obter os dados do form:

```typescript
@ViewChild(OrderFormComponent) orderForm: OrderFormComponent;
// ...
getFormData(order: OrderFormData) {       ← @Output do form
  this.order = order;
}
// ...
createOrder() {
  this.orderForm.submitOrder();           ← ViewChild: emite formData via output
  //                                    ^
  //                                    depende que submitOrder() emita
  //                                    o evento e getFormData() rode ANTES
  const order: Order = {
    id: `${this.order.foodName} + ${Date.now()}`,
    //    ^^^^^^^^^^^^^
    //    lê this.order que foi setado pelo getFormData
  };
}
```

### Por que mudar

- A ordem de execução entre `submitOrder()` (que emite `formData`) e a leitura de `this.order` depende do event loop síncrono. Um `async/await` ou mudança na implementação do `submitOrder()` quebra a lógica.
- `@ViewChild` + `@Output` para o mesmo propósito é redundante e confuso.

### Como fazer

**Opção A (recomendada):** `createOrder` receber os dados explicitamente pelos parâmetros:

```html
<app-button (buttonAction)="createOrder()" />
<!--                                            ↑ sem argumento -->
```

Mudar para:

```html
<app-button (buttonAction)="createOrder(orderForm.getRawValue())" />
```

Ou criar um método no template que coleta os dados:

```typescript
createOrder(formData: OrderFormData) {
  const order = this.orderService.addOrder(formData, this.sharedFood);
  this.resetCheckbox.update(v => v + 1);
}
```

**Opção B:** Manter o `@Output` mas ler os dados do form diretamente no `createOrder()` sem depender do callback:

```typescript
createOrder() {
  const formData = this.orderForm.submitOrder(); // retorna os dados
  const order = this.orderService.addOrder(formData, this.sharedFood);
  this.resetCheckbox.update(v => v + 1);
}
```

Isso exige mudar `submitOrder()` de `void` para `OrderFormData`:

```typescript
submitOrder(): OrderFormData {
  const order = this.orderForm.value as OrderFormData;
  this.formData.emit(order);
  this.orderForm.reset();
  return order;
}
```

---

## 3. Quebrar dependência do `SessionService` (DIP/ISP)

### Onde está hoje

```typescript
constructor(
  private sessionService: SessionService,  ← único serviço central
  private router: Router,
  private route: ActivatedRoute
) {}
```

`SessionService` expõe 4 domínios diferentes:

```typescript
export class SessionService {
  private users: BehaviorSubject<User[]>; // 1
  private orders: BehaviorSubject<Order[]>; // 2
  private finalOrder: BehaviorSubject<FinalOrder>; // 3
  private changeBgColor: BehaviorSubject<string>; // 4
  private path: BehaviorSubject<string>; // 5
}
```

### Por que mudar

**Interface Segregation Principle (ISP):** O componente assina 4 métodos de `SessionService` mas o serviço expõe 10. O componente fica acoplado a métodos que não usa.

**Dependency Inversion Principle (DIP):** O componente depende de uma implementação concreta (`SessionService`), não de uma abstração. Trocar a fonte de dados exige alterar o componente.

### Como fazer

Criar repositórios focados:

```typescript
// shared/services/order.repository.ts
@Injectable({ providedIn: 'root' })
export class OrderRepository {
  private readonly storage = new BehaviorSubject<Order[]>([]);

  getOrders(): Observable<Order[]> {
    return this.storage.asObservable();
  }

  saveOrders(orders: Order[]): void {
    this.storage.next(orders);
  }
}
```

```typescript
// shared/services/user.repository.ts
@Injectable({ providedIn: 'root' })
export class UserRepository {
  private readonly storage = new BehaviorSubject<User[]>([]);

  getUsers(): Observable<User[]> {
    return this.storage.asObservable();
  }

  saveUsers(users: User[]): void {
    this.storage.next(users);
  }
}
```

Componente passa a injetar só o que precisa:

```typescript
constructor(
  private orderRepo: OrderRepository,
  private userRepo: UserRepository,
) {}
```

O `SessionService` pode ser removido ou mantido como wrapper para compatibilidade (legado) até que todos os consumidores migrem.

---

## 4. Migrar estado restante para signals

### Onde está hoje

Estado misturado:

```typescript
// signals
readonly isDeleteModalOpen = signal(false);
readonly orderToDelete = signal<Order | null>(null);
resetCheckbox = signal(0);

// plain properties
usersList: User[] = [];
orders: Order[] = [];
quantity = 1;
sharedFood: User[] = [];
isEdit = false;
isSubmitButton = false;
hasUserSelected = false;
```

### Por que mudar

- `OnPush` só reage a mudanças de `@Input` e quando um **signal é atualizado**. Plain properties só disparam change detection se um evento do próprio componente ou `@Input` mudar. Com signals, o Angular sabe exatamente **quais partes do template** atualizar.
- Padroniza o código — time não precisa pensar "isso aqui usa signal e aquilo não".
- Signals são imutáveis por design e mais fáceis de rastrear/debugar.

### Como fazer

```typescript
readonly usersList = signal<User[]>([]);
readonly orders = signal<Order[]>([]);
readonly sharedFood = signal<User[]>([]);
readonly isEdit = signal(false);
readonly isSubmitButton = signal(false);
readonly hasUserSelected = signal(false);

quantity = 1; // esse pode continuar plain se só for usado no template com two-way
```

Ajustar o template:

```html
@if (isEdit()) {
<!-- signal precisa () no template -->
<h1 class="primary">Modificar item</h1>
}

<app-card-orders [orders]="orders()" />
<!-- signal -> () -->
```

---

## 5. Remover código morto e comentado

### Onde está hoje

```typescript
// order.component.ts
value = ''; // nunca usado
orderToEditId = ''; // nunca usado
```

```typescript
setOrderForEdit({ name, price, sharedUsers = [], quantity }: Order) {
  // this.orderForm.patchValue({          ← bloco inteiro comentado
  //   foodName: name,
  //   price: price,
  // });
  this.quantity = quantity;
  // sharedUsers.forEach((user: User, index: number) => { ← e mais 8 linhas...
}
```

```typescript
editOrder() {
  if (this.orderToEditOrDelete) {
    // const formValues = this.orderForm.value;  ← outro bloco comentado
    // this.orders.forEach((order, index) => {
    //   ...
    // });
    this.saveOrders();
    this.navigateTo();
  }
}
```

```html
<!-- order.component.html — linha 51 -->
<app-button
  [isDisabled]=""                         <!-- binding vazio -->
  ...>
</app-button>
```

```typescript
// imports
import { ElementRef } from '@angular/core'; // não usado
```

### Por que mudar

- Código comentado não é executado, **não é testado** e apodrece (fica desatualizado)
- Propriedades não usadas poluem a API pública do componente
- `[isDisabled]=""` é um bug em potencial (deveria ser omitido ou ter um valor real)
- Poluição visual — dificulta ler o que realmente importa

### Como fazer

- Remover `ElementRef`, `value`, `orderToEditId`
- Remover blocos comentados em `setOrderForEdit` e `editOrder`
- Se `setOrderForEdit` ficar vazio, remover o método e o `getPath` que o chama
- Trocar `[isDisabled]=""` por omissão do atributo (o botão não é disabled)

---

## 6. Gerar IDs com `crypto.randomUUID()`

### Onde está hoje

```typescript
id: `${this.order.foodName} + ${Date.now()}`;
```

### Por que mudar

- **Colisão:** dois pedidos de mesmo nome criados no mesmo milissegundo geram o mesmo ID
- **Parsing:** o formato string `"Pizza + 1720000000000"` não é um identificador limpo
- `Date.now()` não é universalmente único em cenários concorrentes

### Como fazer

```typescript
id: crypto.randomUUID();
// → "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

`crypto.randomUUID()` é nativo em todos browsers modernos (Node 19+, Chrome 54+, Firefox 95+, Safari 15.4+). Sem dependências externas.

---

## 7. Extrair navegação para serviço

### Onde está hoje

```typescript
navigateTo() {
  this.router.navigate(['resumo']);
}

goToSummary() {
  if (this.canEnableButtonGoToSummary()) {
    this.saveOrders();
    this.navigateTo();
  }
}

editarPessoas() {
  this.sessionService.setOrders(this.orders);
  this.sessionService.setPath('/ordens');
  this.router.navigate(['registrar']);
}
```

### Por que mudar

- Rotas espalhadas pelo componente dificultam mudar URLs
- `editarPessoas` mistura persistência, navegação e setagem de path — responsabilidades diferentes
- A regra "vai pra resumo se tem pedidos" (`canEnableButtonGoToSummary`) faz sentido estar em um serviço de roteamento ou no próprio template

### Como fazer

```typescript
// features/order/services/order-navigation.service.ts
@Injectable({ providedIn: 'root' })
export class OrderNavigationService {
  constructor(
    private router: Router,
    private orderRepo: OrderRepository
  ) {}

  goToSummary(orders: Order[]): void {
    if (orders.length > 0) {
      this.router.navigate(['resumo']);
    }
  }

  goToRegistration(): void {
    this.router.navigate(['registrar']);
  }
}
```

---

## Prioridade de implementação

| #   | O quê                        | Esforço | Impacto                                    |
| --- | ---------------------------- | ------- | ------------------------------------------ |
| 1   | Extrair CRUD para serviço    | 2h      | 🔴 Remover lógica de negócio do componente |
| 2   | Migrar estado para signals   | 1h      | 🔴 Padronizar, otimizar change detection   |
| 3   | Limpar código morto          | 30min   | 🔴 Reduzir ruído, evitar bugs              |
| 4   | Corrigir fluxo `createOrder` | 30min   | 🟡 Tornar fluxo explícito                  |
| 5   | Gerar UUID nativo            | 5min    | 🟡 Evitar colisão de ID                    |
| 6   | Quebrar `SessionService`     | 2-3h    | 🟡 Desacoplar dependências                 |
| 7   | Extrair navegação            | 1h      | 🟢 Separar responsabilidade                |
