# Melhoria de Performance — ContaJusta

## Problemas Identificados

### 1. Falta de `ChangeDetectionStrategy.OnPush` (ALTO IMPACTO)

Apenas `OrderFormComponent` usa `OnPush`. Os outros 5 components usam detecção de mudança **default**, fazendo Angular reavaliar toda a árvore de componentes a cada evento (teclado, clique, hover, etc).

**Componentes afetados:**
- `OrderComponent` — `order.component.ts:11`
- `CardOrdersComponent` — `card-orders.component.ts:7`
- `UserCheckboxComponent` — `user-checkbox.component.ts:4`
- `OrderDivisionComponent` — `order-division.component.ts:8`
- `TooltipComponent` (shared) — `tooltip.component.ts`

---

### 2. Falta de `trackBy` em `*ngFor` (ALTO IMPACTO)

Nenhum `*ngFor` no projeto usa `trackBy`. Sem isso, Angular destrói e recria todo o DOM da lista a cada mudança de referência do array, mesmo que os dados sejam idênticos.

**Ocorrências (4):**

| Arquivo | Linha | Contexto |
|---|---|---|
| `order-division.component.html` | 6 | Lista de `orderPerUser` |
| `order-division.component.html` | 12 | Lista de `user.orders` (aninhado) |
| `card-orders.component.html` | 6 | Lista de `orders` |
| `user-checkbox.component.html` | 11 | Lista de `usersList` |

---

### 3. Memory leaks — subscriptions sem unsubscribe (ALTO IMPACTO)

Dois components se inscrevem em Observables mas nunca fazem unsubscribe.

**`OrderComponent`** (`order.component.ts:103-123`):
- 2 subscriptions sem cleanup
- Nem implementa `OnDestroy`

**`OrderDivisionComponent`** (`order-division.component.ts:41-64`):
- 2 subscriptions sem cleanup
- Implementa `OnDestroy` mas o método só chama `changeBackground()`

---

### 4. Funções chamadas no template (MÉDIO IMPACTO)

Funções no template rodam em cada ciclo de change detection, mesmo sem mudança de dados.

| Arquivo | Linha | Problema |
|---|---|---|
| `card-orders.component.html` | 11 | Chamada dupla encadeada: `getFormattedUserNamesForDisplay(getMaxNumberOfUsersInDisplay(...))` |
| `card-orders.component.html` | 20 | Mesma função chamada 2ª vez com lista completa |
| `card-orders.component.html` | 29 | `multiplyValues()` chamada por item |
| `order-form.component.html` | 10,12,15 | `isFormValid()` chamada 3x |
| `order.component.html` | 68 | `canEnableSubmitItemButton()` chamada toda hora |

---

### 5. Eventos `mouseover`/`mouseout` (MÉDIO IMPACTO)

**`card-orders.component.html:15-16`** — `mouseover`/`mouseout` disparam muitas vezes (a cada pixel de movimento do mouse sobre filhos). Com change detection default, cada evento dispara re-render completo.

Deveria usar `mouseenter`/`mouseleave` (não fazem bubble, disparam menos).

---

### 6. `console.log` em produção (BAIXO IMPACTO)

**`card-orders.component.ts:22`** — `console.log('this.orders', this.orders)` — desnecessário e gera pressão de memória.

---

### 7. Binding vazio (BUG)

**`order.component.html:62`** — `[isDisabled]=""` — binding vazio que pode causar comportamento inesperado.

---

## Ordem de Implementação

1. OnPush nos 5 components
2. trackBy em todos os 4 `*ngFor`
3. Fixar subscriptions com `takeUntil`
4. Converter chamadas de função no template para getters/propriedades
5. Trocar `mouseover`/`mouseout` por `mouseenter`/`mouseleave`
6. Remover `console.log`
7. Corrigir binding vazio
