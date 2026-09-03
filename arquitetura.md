Todas as decisões fechadas. Segue a arquitetura final consolidada para o backend.
Stack

- Java 21 + Spring Boot 4.1.1 + Maven (já no esqueleto)
- spring-webmvc (REST), spring-data-jdbc, spring-security, PostgreSQL (docker-compose), H2 (testes), Lombok
- Testes: JUnit + Spring Boot Test + MockMvc

Estrutura de pacotes (com.example.conta_justa)
api/ → Controllers + DTOs + ExceptionHandler (Problem Details/RFC 7807)
application/ → use cases: UserService, OrderService, GroupService, DivisionService
domain/ → entidades/aggregates + regras + calculadora de divisão
infra/ → repositórios (Spring Data JDBC), SecurityConfig, WebConfig

Modelo de domínio (relacional)
GROUPS(id UUID PK, name, created_at)
USERS(id UUID PK, group_id FK, name)
ORDERS(id UUID PK, group_id FK, name, price NUMERIC, quantity INT)
ORDER_SHARED_USERS(order_id FK, user_id FK, PK(order_id,user_id))

- Monetário: BigDecimal (colunas NUMERIC(12,2)) — nunca double
- sharedUsers = muitos-para-muitos via tabela de junção
- IDs gerados no servidor (UUID). Frontend passa a usar o id retornado.

Endpoints REST (todos escopados por grupo)
POST /groups → criar grupo (retorna {groupId})
GET /groups/{groupId} → resumo (ou nada se group vazio)

GET /groups/{groupId}/users POST/PUT/DELETE
POST /groups/{groupId}/users
PUT /users/{id}
DELETE /users/{id}

GET /groups/{groupId}/orders
POST /groups/{groupId}/orders
PUT /orders/{id}
DELETE /orders/{id}

POST /orders/preview-division → body { tax, orders[] } → OrderPerUser[]
Regra de divisão (porta fiel do order-calculator.ts)

- valor com taxa = price _ quantity _ (1 + tax/100) usando BigDecimal
- divisão igual entre sharedUsers; resto de centavo vai para o último usuário
- erro se sharedUsers vazio / usuário inexistente / tax < 0

Validação (jakarta Bean Validation, mensagens PT-BR)

- nome ≤ 25 · item ≤ 30 · price ≥ 0.01 · quantity ≥ 1 · tax em 0–100 · mínimo 2 usuários no grupo

Autenticação simples (sessão/API key)

- SecurityConfig permitindo CORS do frontend; endpoint POST /auth devolve um token/API key (JWT ou opaco) usado via Authorization header
- Endpoints /health (actuator) públicos

Infra (docker-compose.yaml — hoje vazio)

- serviço postgres (volumes persistentes) + serviço backend (build do jar)
- application.properties: datasource Postgres em prod, H2 (in-memory) nos testes

Sequência de implementação sugerida

1. Entidades + repositórios JDBC + schema (Flyway ou schema.sql)
2. DivisionService + testes (portando os specs do order-calculator.spec.ts)
3. Controllers de groups/users/orders
4. Validação + ExceptionHandler (erros PT-BR no formato problem+json)
5. Autenticação simples (/auth + filtro)
6. docker-compose (Postgres + backend) + Documentação dos endpoints
