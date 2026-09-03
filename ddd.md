# DDD — Plano de estudo e implementação do backend ContaJusta

opencode -s ses_fb66e4998ffeohnBxvPHS5XNFS

> Guia para aprender a modelar com Domain-Driven Design e, em paralelo, desenvolver o
> backend Spring Boot do ContaJusta. Cada conceito é aplicado ao próprio projeto.

---

## 1. Por que DDD aqui?

O frontend (Angular) já definiu o problema e as regras. O backend só precisa dar nome
e organização a isso. DDD é, essencialmente:

> Agrupar o código em torno do **que o negócio faz** (domínio), e não em volta de
> tabelas, controllers ou HTTP.

Tabelas e HTTP viram "detalhes de infra" — o coração é o domínio.

### O que o frontend já nos deu (fonte da verdade)

- Entidades: `User`, `Order`, `FinalOrder`.
- Regras em `order-calculator.ts`:
  - valor com taxa = `price * quantity * (1 + tax/100)`
  - divisão igual entre `sharedUsers`; **resto de centavo vai para o último usuário**
  - erros: item sem usuários, usuário inexistente, taxa negativa.
- Validações: nome ≤ 25, item ≤ 30, `price ≥ 0.01`, `quantity ≥ 1`, tax 0–100, mínimo 2 usuários.

---

## 2. Os dois níveis do DDD

| Nível           | O que é                                                     | No ContaJusta                              |
| --------------- | ----------------------------------------------------------- | ------------------------------------------ |
| **Estratégico** | O mapa: linguagem ubíqua, contextos, agregados              | Definir `Group` como núcleo, nomear termos |
| **Tático**      | O código: entidades, VOs, serviços de domínio, repositórios | Classes Java que implementam o modelo      |

---

## 3. Passos de modelagem (aplicados)

### Passo 1 — Linguagem ubíqua

> Uma **conta** (Group) tem **usuários** e **pedidos**. Um pedido é um **item** que pode
> ser **compartilhado** entre usuários. No final, **dividimos** o valor de cada item
> (com **taxa**) igualmente entre os compartilhantes.

Cada termo em negrito vira um conceito/classe. Use sempre estes termos no código (não
"table", "row", "record").

### Passo 2 — Agregado raiz (fronteira de consistência)

Pergunta: _qual objeto pode ser carregado/modificado sozinho sem quebrar a regra?_

No ContaJusta o agregado é **`Group`** — dono de `users` e `orders`. Nunca editamos um `Order` fora do contexto de um `Group`.

### Passo 3 — Entidade vs. Objeto de Valor (VO)

- **Entidade** (tem identidade `id`): `Group`, `User`, `Order`.
- **Valor** (sem id, é só dado): `Money` (preço/total). **Nunca `double` para dinheiro** —
  usar `BigDecimal`.

### Passo 4 — Serviço de domínio (regra pura, sem I/O)

`DivisionService`: portar `calculateConsumption(users, orders, tax)` do TS para Java.
Sem SQL e sem HTTP dentro — recebe listas e devolve listas.

### Passo 5 — Repositório (porta de saída, de infra)

```java
public interface GroupRepository {
    Optional<Group> findById(UUID id);
    void save(Group group);
}
```

O domínio usa a interface; a implementação com Spring Data JDBC fica em `infra`.

### Passo 6 — Aplicação + API (porta de entrada)

- `GroupService` (use case): recebe DTO → chama domínio → pede repositório para salvar.
- Controller: só traduz JSON ↔ DTO e delega. **Zero regra de negócio no controller.**

---

## 4. Arquitetura final (decisões já tomadas)

- Java 21 + Spring Boot 4.1.1 + Maven (esqueleto existente em `backend/conta-justa`).
- `spring-webmvc`, `spring-data-jdbc`, `spring-security`, PostgreSQL (docker-compose), H2 (testes), Lombok.
- **Backend é fonte da verdade** para divisão de conta.
- **Auth simples** (sessão/API key).
- **PostgreSQL via docker-compose** em produção; H2 in-memory em testes.
- **Modelo de sessão: `Group` explícito** (suporta histórico e compartilhamento por link).

### Estrutura de pacotes (`com.example.conta_justa`)

```
api/          → Controllers + DTOs + ExceptionHandler (Problem Details / RFC 7807)
application/  → use cases: GroupService, UserService, OrderService, DivisionService
domain/       → entidades/agregados (Group, User, Order) + VO (Money) + regras
infra/        → repositórios (Spring Data JDBC), SecurityConfig, WebConfig
```

### Modelo relacional

```
GROUPS(id UUID PK, name, created_at)
USERS(id UUID PK, group_id FK, name)
ORDERS(id UUID PK, group_id FK, name, price NUMERIC(12,2), quantity INT)
ORDER_SHARED_USERS(order_id FK, user_id FK, PK(order_id, user_id))
```

- Monetário: `BigDecimal` (colunas `NUMERIC(12,2)`).
- `sharedUsers` = m:n via `ORDER_SHARED_USERS`.
- IDs gerados no **servidor** (UUID); frontend passa a usar o id retornado.

### Endpoints (escopados por grupo)

```
POST   /groups                          → criar grupo → {groupId}
GET    /groups/{groupId}                → resumo do grupo

GET    /groups/{groupId}/users
POST   /groups/{groupId}/users
PUT    /users/{id}
DELETE /users/{id}

GET    /groups/{groupId}/orders
POST   /groups/{groupId}/orders
PUT    /orders/{id}
DELETE /orders/{id}

POST   /orders/preview-division         → body { tax, orders[] } → OrderPerUser[]

POST   /auth                            → token/API key
GET    /health                          → público
```

### Regras de divisão (portar fielmente)

- valor com taxa = `price * quantity * (1 + tax/100)` com `BigDecimal`.
- divisão igual; **resto de centavo vai para o último usuário**.
- erro se `sharedUsers` vazio, usuário inexistente, ou `tax < 0`.

### Validação (jakarta Bean Validation, mensagens PT-BR)

nome ≤ 25 · item ≤ 30 · `price ≥ 0.01` · `quantity ≥ 1` · tax 0–100 · mínimo 2 usuários.

---

## 5. Roteiro de estudo (em ordem)

1. **DDD em geral** — _Domain-Driven Design Distilled_ (Vaughn Vernon, ~130 p., começo leve).
   Depois, se quiser profundidade: _Implementing Domain-Driven Design_ (Vernon).
2. **DDD + Java/Spring** — artigos do Thorben Janssen e o site `https://arhohuttunen.com`
   (post "Spring Data JDBC" é exatamente o caso do ContaJusta).
3. **Spring Data JDBC** — documentação oficial (seção de aggregate roots, m:n e junções).
4. **Prática** — modelar o ContaJusta na mão, começando por `Group` + `DivisionService`
   (portar o `order-calculator.spec.ts` para JUnit).

---

## 6. Plano de implementação (aprender fazendo)

### Etapa 1 — Modelar o domínio (núcleo, sem infra)

Arquivos em `domain/`:

- `Group` (agregado raiz): `id`, `name`, coleção de `User` e de `Order`. Métodos de domínio
  para adicionar/remover usuários e pedidos, respeitando as invariantes (mín. 2 usuários).
- `User` (entidade): `id`, `name`.
- `Order` (entidade): `id`, `name`, `price` (`Money`), `quantity`, `sharedUsers`.
- `Money` (VO): `BigDecimal` + operações de soma/multiplicar/arredondar.
- `OrderPerUser`, `SharedFood` (resultados da divisão — DTOs de domínio).

**Conceitos:** agregado, invariante, entidade, VO.

### Etapa 2 — `DivisionService` + testes (portar `order-calculator.ts`)

- Portar `calculateConsumption` e `sumTotalOrders` para Java.
- Escrever **JUnit** baseado no `order-calculator.spec.ts` (mesmos cenários):
  divisão exata, resto de centavo, taxa > 0, lista vazia, taxa negativa (erro), item sem
  usuários (erro).

**Conceitos:** serviço de domínio, testes de regra pura (sem Spring).

### Etapa 3 — Repositórios (Spring Data JDBC)

- `GroupRepository`, `UserRepository`, `OrderRepository` em `infra/`.
- `OrderRepository` resolve o m:n `ORDER_SHARED_USERS` (query própria para carregar
  `sharedUsers`).
- Schema via Flyway ou `schema.sql`.

**Conceitos:** repositório, porta de saída, m:n sem entidade de junção.

### Etapa 4 — Camada de aplicação (`GroupService` etc.)

- Use cases orquestrando domínio + repositórios.
- `GroupService` retorna DTOs (não vaza entidade para a API).

**Conceitos:** use case, DTO, camada de aplicação.

### Etapa 5 — API e validação

- Controllers (`GroupController`, `UserController`, `OrderController`, `DivisionController`).
- Bean Validation + `ExceptionHandler` → erros PT-BR em `application/problem+json`.

**Conceitos:** porta de entrada, contrato REST, tratamento de erro.

### Etapa 6 — Autenticação simples

- `POST /auth` devolve token; filtro valida `Authorization`; CORS liberado para o frontend.

### Etapa 7 — Infra (docker-compose + docs)

- Preencher `compose.yaml`: serviço `postgres` + serviço `backend`.
- `application.properties`: Postgres em prod, H2 em teste.
- Documentar endpoints.

---

## 7. Como seguiremos juntos

1. Eu te ensino cada conceito **antes** de escrever o código correspondente.
2. A cada etapa, explico o _porquê_ e mostro o código resultante no repositório.
3. Você acompanha pelo `ddd.md` (este arquivo) como referência.

Próximo passo sugerido: **Etapa 1** — modelar `Group`, `User`, `Order` e `Money` no domínio.
