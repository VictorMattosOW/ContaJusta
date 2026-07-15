# Avaliação e Sugestão de Melhorias — ContaJusta (Angular 15)

## Visão Geral do Projeto

O **ContaJusta** é uma aplicação web mobile para divisão de contas de restaurante. Permite cadastrar pessoas, adicionar itens do pedido com preço/quantidade, selecionar quem vai dividir cada item e, no final, calcular o valor que cada pessoa deve pagar, incluindo taxa de serviço.

---

## Pontuação Geral: ⭐⭐⭐ (3/5)

O projeto mostra um bom esforço acadêmico/prático para alguém que está aprendendo, mas evidencia bastante que o autor está absorvendo conteúdo e ainda não domina profundamente os padrões do Angular/frontend.

---

## Avaliação por Categoria

### 1. Estrutura de Arquitetura

**O que foi bem feito:**
- Utiliza **lazy loading** básico com `loadChildren` no `app-routing.module.ts` ✅
- Aplica o conceito de **Feature Modules** com `PagesModule` ✅
- Separação por responsabilidade (módulo compartilhado `shared` e de páginas `pages`) ✅

**O que precisa ser melhorado:**
- `TooltipComponent` importado no `AppModule` mas **declarado no PagesModule** (conflito de responsabilidade e duplicidade) ❌
- `PagesModule` está fazendo o papel de **feature module e shared module ao mesmo tempo** (os componentes `ButtonComponent`, `ButtonLinkComponent`, `TooltipComponent` deveriam estar em um módulo `Shared` separado) ❌
- `AppModule` importa `CommonModule` desnecessariamente ❌

---

### 2. Controle de Estado / Serviços

**Ponto Positivo:**
- Uso de **BehaviorSubject** para service que comunica dados entre componentes ✅
- Serviços `OrderService`, `UserServiceService` e `SessionService` são bem funcionalidades de negócio separadas ✅

**Problemas Graves:**
- `UserServiceService` é um nome de classe repulsivo para padrões da comunidade (duplica o sufixo *Service*) ❌
- Abstração inicial de classe `AbstractComponent` que faz coisas completamente descoladas de uma abstração de componente (manipulação manual de arrays de boolean de tooltip!) ❌
- Nomeamento inconsistente de métodos: `calcularValorFinal` (português) vs `sumTotalOrders` (inglês) ❌

---

### 3. Componentes e Templates

**Qualidades:**
- Inputs/Outputs bem usados nos componentes reutilizáveis (`app-button`, `app-button-link`) ✅
- Uso correto de diretiva `@Directive` para autofocus ✅

**Problemas:**
- `order.component.ts`: mistura pesada de lógica de form, lógica de negócio, manipulação de DOM (dialogs) e navegação no mesmo componente (200+ linhas de responsabilidade acumulada) ❌
- `RegistrationComponent`: uso desnecessário de `AfterViewChecked` com `detectChanges` — forte indicação de desconhecimento sobre o ciclo de vida do Angular ❌

---

### 4. Segurança e Qualidade de Código

- Tratamento de `snapshot` do `Route` ao invés de observar parâmetros via `paramMap` (`ActivatedRoute`) ❌
- Configuração de `strict: false` no `tsconfig.json` (permissivo excessivo que evita checagem de tipos rigorosa) ❌
- Ausência de tratamento de error nos observables (métodos sem `error` handler em alguns casos) ❌
- Vulnerabilidade de segurança no campo percentual que não limita input menor que zero ❌
- Componente sem tratamento de unsubscribe nos subscriptions — **fuga de memória direto** ❌

---

### 5. Testes Automatizados

- Apenas **2 testes unitários** (gerados automaticamente pelo CLI) doing `toBeTruthy()`
- Componentes não possuem testes unitários
- Services sem cobertura real
- `app.component.spec.ts` ainda mantem teste padrão branco que não verifica a aplicação real
- **Cobertura estimada de testes: 3-5%**

---

### 6. Observações de Código-Fonte

- Commit messages em português em um repositório com código em inglês — mistura de idiomas
- Branching strategy excessivamente granular para um projeto de 1 pessoa (`feature/create-tooltip`)
- `TODO` comments abandonados no código (`// TODO: vai vazar daqui`)

---

## Análise de Senioridade

Considerando os critérios de análise abaixo:

| Critério | Nota | Comentário |
|---------------------------|------|-------------|
| **Arquitetura** | ⭐⭐⭐ | Lazy loading e modularização básicos presentes |
| **Design Patterns** | ⭐⭐ | Alguns padrões básicos, muitos anti-patterns |
| **Qualidade de Código** | ⭐⭐ | Muitos sinais de refatoração pendente |
| **Segurança** | ⭐ | Problemas de memory leak, validação insuficiente |
| **Domínio Angular** | ⭐⭐⭐ | Componentes básicos, mas crimes ao ciclo de vida |
| **Testes Automatizados** | ⭐ | Quase nenhum teste de valor |
| **Boas Práticas Gerais** | ⭐⭐ | Código funcional, mas não "production ready" |

---

## Veredito: Nível Junior-Pleno

O autor demonstra mais características de um desenvolvedor **JUNIOR a DESEJANDO Junior-Pleno** (2 a 4 anos de experiência).

### Observações:
- Tem **noções fundamentais** de Angular (módulos, componentes, serviços, lazy loading)
- **Domínio funcional**: entrega um software que funciona para o usuário final
- **Mas comete erros típicos de quem ainda está em transição para pensar em engenharia de software**:
  - Dificuldade em separar responsabilidades de componentes
  - Memory leaks deixados para trás
  - Decisões arquiteturais mistas (componente genérico que vaza lógica de UI para componente abstrato)
  - Ausência de testes que valide regras de negócio
  - Merge pull requests em projeto de uma pessoa (mostra conhecimento de processo, mas aplicado fora de contexto)

### Tanáreira Plena?

Não. Uma pessoa pleno teria:
- Menos código no componente e melhor separação de responsabilidades
- Tratamento apropriado de unsubscribes
- Validação de tipos ativa (`strict: true`)
- Uso de Angular Signals ou gerenciamento de estado mais robusto
- Muito maior cobertura de testes (principalmente unitários para regras de negócio)

---

## Recomendações de Melhoria para o Autor

1. **Estudar princípios SOLID** e especialmente SRP (Single Responsibility Principle)
   - Refatore o `order.component.ts`: extraia a lógica do formulário para um outro componente. Extraia a lógica de manipulação de modal para um outro componente. Extraia a lógica de validação para um serviço ou para o próprio gerenciamento do `FormGroup`.

2. **Implementar `async` pipe e resolver memory leaks** nos observables
   - Utilize o `async` pipe no template para observables. Se não for possível, salve a inscrição em uma variável e chame `unsubscribe()` no `ngOnDestroy`.

3. **Refatorar `AbstractComponent`** e mover comportamento de tooltip para componente ou diretiva especializada
   - `AbstractComponent` possui lógica de tooltip (`onHover`, `onMouseout`) e de multiplicação de valores (`multiplayValues`), que são responsabilidades totalmente distintas e específicas. Isso viola o ISP (Interface Segregation Principle).

4. **Adotar `strict: true`** no tsconfig e fixar tipagens
   - A configuração `strict: false` permite que erros de tipo passem despercebidos. Ative `strict: true` e corrija todos os erros de tipagem que surgirem. Isso aumentará significativamente a robustez do projeto.

5. **Implementar testes** — começar por testar as funções do `OrderService`
   - O `OrderService` possui a lógica central de cálculo. Comece escrevendo testes unitários para os métodos `calculateConsumption` e `sumTotalOrders`, validando cenários de borda (ex: porcentagem zero, lista de usuários vazia, etc.).

---

## 6. Estratégia de Versionamento e Commits

### Problemas Identificados
- **Branches e Pull Requests solo**: Criar `feature/create-tooltip` e abrir PR para si mesmo em projeto de uma pessoa é burocracia desnecessária. Branches e PRs existem para code review em equipe.
- **Mensagens de commit pouco descritivas**: `fix maths`, `ajuste border checkbox`, `go to start` não explicam a intenção da mudança.
- **Commits de "micro-ajustes"**: Múltiplos commits para pequenas correções visualis deixam o histórico poluído (ex: `ajuste msg de erro` → `ajuste border checkbox`).
- **Mistura de idiomas**: Código em inglês, mas commits em português.

### Abordagem Recomendada: Commits Diretos na `main` (Projeto Solo)

1. **Trabalhe direto na `main`**
   - Não existe motivo funcional para branches em projeto solo. Faça commits direto na `main` quando uma feature ou correção estiver completa.

2. **Commits devem estar no idioma do projeto (inglês)**
   - Se o código está em inglês, os commits também devem estar, para manter consistência.

3. **Commit pequeno e descritivo — como se estivesse explicando para um colega** 
   - Use o padrão `type(escopo): descrição` (Conventional Commits).

### Exemplos de Commits Ruins vs. Bons

| ❌ Commit Ruim | ✅ Commit Bom |
|---------------|---------------|
| `fix maths` | `fix(service): corrige arredondamento na divisão de valores` |
| `ajuste border checkbox` | `style(checkbox): ajusta espessura da borda` |
| `go to start` | `fix(router): redireciona para tela inicial após divisão da conta` |
| `test tooltip` | `test(tooltip): adiciona testes de visibilidade do componente` |
| `ajuste msg de erro` | `feat(i18n): melhora mensagens de erro do formulário de usuário` |
| `create a error form` | `feat(forms): implementa validação e exibição de erros no registro` |

### Estrutura de Referência para Commits (Conventional Commits)

```bash
<type>(<escopo opcional>): <descrição>

# Types comuns:
# feat: nova funcionalidade
# fix: correção de bug
# refactor: refatoração de código sem mudar funcionalidade
# style: formatação, semicolons, etc; sem mudança de lógica
# docs: mudanças na documentação
# test: adicionando ou corrigindo testes
# chore: manutenção de build, dependências, etc.
```

### Exemplo Prático de Histórico Limpo

```bash
# Cenário: você está implementando a tela de divisão de pedido

feat(division): implementa cálculo de consumo por usuário
  - Adiciona OrderDivisionComponent
  - Cria método calculateConsumption no OrderService

fix(division): corrige arredondamento de centavos na divisão

style(division): ajusta layout dos cards de resultado

test(division): adiciona testes para cálculo com 10% de taxa
```

O projeto é uma demonstração competente de que o desenvolvedor está progredindo, mas claramente ainda está se desenvolvendo para alcançar um patamar pleno confiável em Angular.

---

## 7. Arquitetura de Pastas: Core, Shared e Features

### O problema de jogar tudo em `pages`

O que você chamou de `pages` funciona como uma lógica direta de **tela** — agrupando componentes visuais que respondem a rotas. No entanto, essa abordagem não captura o que cada parte do sistema **faz** (a feature em si). Jogar `OrderService`, `SessionService` e models dentro de `pages/` espalha a lógica do negócio entre componentes, serviços e models genéricos, dificultando manutenção e evolução.

### O que é uma `feature`?

Uma **feature** é uma **capacidade completa do sistema**, não apenas uma tela. Ela contém todo o código necessário para realizar uma operação de negócio isolada:

- **Components** (telas e sub-componentes)
- **Models**
- **Services**
- **Pipes e Diretivas específicas**
- **Guards** (se necessário)
- **Testes**

### Por que separar por `features` é melhor?

Imagine uma alteração em como o cálculo de divisão de pedido funciona:

- Na sua estrutura atual, o arquivo da regra pode estar em `src/app/shared/services/order.service.ts`, mas os componentes em `src/app/pages/order-division/`.
- Em uma arquitetura por Features, tudo vive junto em `src/app/features/order/`, então o desenvolvedor sabe **exatamente** onde encontrar e modificar.

**Alta Coesão**: tudo relacionado a uma funcionalidade vive junto.
**Baixo Acoplamento**: uma mudança em uma feature não afeta as outras.

---

### A diferença entre `core`, `shared` e `features`

| Pasta | Descrição | Exemplos |
|-------|-----------|----------|
| `core/` | Lógica transversal global. O sistema inteiro depende disso. Apenas coisas que **nenhuma** feature específica deveria "possuir". | `StateService`, `HttpInterceptor`, `AuthGuard`, `ErrorHandler`, `Utils` |
| `shared/` | Componentes, pipes, diretivas e utilitários puramente reutilizáveis e não relacionados a regra de negócio. | `ButtonComponent`, `TooltipComponent`, `CurrencyPipe`, `AutofocusDirective` |
| `features/` | Funcionalidades completas e isoladas do produto. Cada pasta é um domínio de negócio. | `user-registration/`, `order/`, `summary/` |

> **Regra de bolso**: Se 3+ features usam → vai para `core/` ou `shared/`. Se é específico de uma funcionalidade → vive dentro da `feature/`.

---

### Estrutura de pastas recomendada para o seu projeto

```
src/app/
├── core/
│   ├── services/
│   │   └── state.service.ts          (antes session.service — global, transversal)
│   │   └── notification.service.ts
│   ├── interceptors/
│   └── guards/
│
├── shared/
│   ├── components/
│   │   ├── button/
│   │   ├── button-link/
│   │   └── tooltip/
│   ├── directives/
│   │   └── autofocus.directive.ts
│   ├── pipes/
│   │   └── currency.pipe.ts
│   └── models/                        (se houver models globais, como User)
│       └── user.model.ts
│
├── features/
│   ├── user-registration/
│   │   ├── components/
│   │   │   └── registration/
│   │   ├── user-registration.module.ts
│   │   └── user-registration-routing.module.ts
│   │
│   ├── order/
│   │   ├── components/
│   │   │   ├── order.component.ts
│   │   │   └── order-division.component.ts
│   │   ├── services/
│   │   │   └── order.service.ts       (move de shared/ para cá)
│   │   ├── models/
│   │   │   └── order.model.ts         (move de shared/ para cá)
│   │   ├── order.module.ts
│   │   └── order-routing.module.ts
│   │
│   └── summary/
│       ├── components/
│       │   └── summary.component.ts
│       ├── summary.module.ts
│       └── summary-routing.module.ts
│
└── app-routing.module.ts
```

---

### Dicas práticas para aplicar

1. **Mova `SessionService` de `shared/services/` para `core/services/`**
   - Ele é transversal, nenhuma feature deveria "possuir" ele.

2. **Mova `OrderService` e `Order` model de `shared/` para dentro da `feature/order/`**
   - A regra de cálculo de pedido deveria viver próximo do lugar que a usa.

3. **Crie uma pasta `shared/components/` e deixe lá os `ButtonComponent` e `TooltipComponent`**
   - Esses artefatos são genéricos e reutilizáveis.

4. **Cada feature deve exportar seu próprio módulo**
   - `OrderModule` importa `SharedModule` e declara seus próprios componentes, serviços e rotas.

---

### Conclusão da Arquitetura

| O que você fez | O que deveria seguir |
|---|---|
| `pages/registration/` → | `features/user-registration/` |
| `pages/order/` → | `features/order/` |
| `shared/services/session.service.ts` → | `core/services/state.service.ts` |
| `shared/services/order.service.ts` → | `features/order/services/order.service.ts` |
| Botões genéricos em `shared/components/` → | Mantenha em `shared/components/` |

Separar por features permite que o código cresça sem ficar um **"big ball of mud"**. Quando sua equipe (ou você no futuro) precisar alterar como a divisão de pedido funciona, o trabalho será localizado em um único lugar.

O projeto é uma demonstração competente de que o desenvolvedor está progredindo, mas claramente ainda está se desenvolvendo para alcançar um patamar pleno confiável em Angular.