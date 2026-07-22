# TODO — Refatorações Pendentes

## CardOrdersComponent

**Arquivos:**
- `src/app/features/order/components/order/card-orders/card-orders.component.ts`
- `src/app/features/order/components/order/card-orders/card-orders.component.html`
- `src/app/features/order/components/order/card-orders/card-orders.component.css`

### 1. Extrair lógica de tooltip para componente próprio (SRP)

Criar um componente `OrderUserDisplay` que encapsula formatação de nomes e lógica de hover/tooltip. Atualmente o `CardOrdersComponent` gerencia 3 responsabilidades: renderizar pedidos, gerenciar tooltip e formatar nomes.

- [ ] Criar componente `order-user-display`
- [ ] Mover `tooltipDisplayStates`, `onHover`, `onMouseout` para o novo componente
- [ ] Mover `getFormattedUserNamesForDisplay` e `getMaxNumberOfUsersInDisplay` para o novo componente
- [ ] Remover lógica de tooltip do `CardOrdersComponent`

### 2. Remover dependência de UserService para operações puras (SRP, DIP)

O `UserService` possui funções que são puras (sem estado): `getConcatenatedUserNames`, `getMaxNumberOfUsersInDisplay`, `maxNumberOfUsersInDisplayValue`. Essas não precisam de um service.

- [ ] Mover `getConcatenatedUserNames` para pipe ou função utilitária
- [ ] Mover `getMaxNumberOfUsersInDisplay` para pipe ou função utilitária
- [ ] Transformar `maxNumberOfUsersInDisplay` em constante
- [ ] Remover injeção de `UserService` do componente (se tooltip for extraído)

### 3. Criar pipe para formatação de nomes (OCP, performance)

Substituir chamadas de função no template por pipe, que é cachingável e não roda em cada ciclo de change detection.

- [ ] Criar `UserNamesPipe` (`shared/pipes/user-names.pipe.ts`)
- [ ] Usar no template: `{{ order.sharedUsers | userNames }}`
- [ ] Registrar no módulo

### 4. Remover `multiplyValues` da classe (ISP, clean code)

Atribuir função importada como propriedade da classe é anti-pattern. A operação `quantity * price` é trivial.

- [ ] Usar inline no template: `{{ order.quantity * order.price | currency }}`
- [ ] Remover `multiplyValues = multiplyValues` da classe
- [ ] Remover import de `multiplyValues` de `utils.ts`

### 5. Corrigir template HTML (semântica, acessibilidade)

| Linha | Problema | Solução |
|---|---|---|
| 1 | Código comentado | Remover |
| 11 | Chamada encadeada de funções | Usar pipe |
| 14 | `style="display: inline-block"` inline | Mover para CSS |
| 15-16 | `mouseover`/`mouseout` | Trocar por `mouseenter`/`mouseleave` |
| 28-31 | `<legend>` para texto comum | Trocar por `<span>` ou `<p>` |
| 33 | `<a>` sem `href` | Trocar por `<button>` (acessibilidade) |

- [ ] Remover código comentado na linha 1
- [ ] Trocar `<legend>` por `<span>` nas linhas 8, 10, 28, 31
- [ ] Trocar `<a>` por `<button>` na linha 33
- [ ] Mover `style="display: inline-block"` para classe CSS
- [ ] Trocar `mouseover`/`mouseout` por `mouseenter`/`mouseleave`

### 6. Corrigir OnPush + tooltip (funcionalidade)

Com `ChangeDetectionStrategy.OnPush`, `this.tooltipDisplayStates[index] = true` não dispara change detection. O tooltip nunca aparece.

- [ ] Usar `ChangeDetectorRef.markForCheck()` após mutar `tooltipDisplayStates`
- [ ] Ou reestruturar para que o tooltip receba estado via `@Input()` do componente pai

### 7. Limpar código morto

- [ ] Remover `console.log('this.orders', this.orders)` na linha 22
- [ ] Remover TODOs das linhas 42, 47 (após extrair tooltip)

---

## OrderComponent

**Arquivo:** `src/app/features/order/components/order/order/order.component.ts`

### 8. Imutabilidade de arrays (OnPush compatibilidade)

`createOrder()` usa `this.orders.push(order)` que muta o array sem criar nova referência. Com OnPush em `CardOrdersComponent`, o card não atualiza.

- [ ] Trocar `this.orders.push(order)` por `this.orders = [...this.orders, order]`
- [ ] Verificar se `deleteItem` já usa `filter` (está OK)

### 9. Subscriptions sem cleanup (memory leak)

`OrderComponent` se inscreve em 2 Observables mas não faz unsubscribe e nem implementa `OnDestroy`.

- [ ] Implementar `OnDestroy`
- [ ] Criar `private destroy$ = new Subject<void>()`
- [ ] Adicionar `.pipe(takeUntil(this.destroy$))` nas subscriptions de `getUsersObservable` e `getOrdersObservable`
- [ ] Chamar `this.destroy$.next()` e `this.destroy$.complete()` no `ngOnDestroy`

### 10. Remover propriedades duplicadas

`OrderComponent` mantém `sharedFood`, `selectedUsers`, `markAllUsers` que são redundantes com o estado do `UserCheckboxComponent`.

- [ ] Remover propriedades duplicadas do pai
- [ ] Usar `@ViewChild` ou `@Input` trigger no filho para reset

---

## OrderDivisionComponent

**Arquivo:** `src/app/features/order/components/order-division/order-division.component.ts`

### 11. Subscriptions sem cleanup (memory leak)

`OrderDivisionComponent` implementa `OnDestroy` mas não faz unsubscribe das 2 subscriptions.

- [ ] Criar `private destroy$ = new Subject<void>()`
- [ ] Adicionar `.pipe(takeUntil(this.destroy$))` nas subscriptions de `getFinalOrderObservable` e `getUsersObservable`
- [ ] Chamar `this.destroy$.next()` e `this.destroy$.complete()` no `ngOnDestroy`

---

## Shared

### 12. Pipe UserNames

- [ ] Criar `src/app/shared/pipes/user-names.pipe.ts`
- [ ] Registrar no módulo compartilhado
- [ ] Usar nos components que precisam formatar nomes de usuários

### 13. Constante maxNumberOfUsersInDisplay

- [ ] Criar `src/app/shared/constants/app.constants.ts`
- [ ] Mover valor `2` para lá
- [ ] Referenciar nos components que precisam
