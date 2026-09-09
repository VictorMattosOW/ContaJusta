/**
 * ============================================================================
 * TESTE 5 — SIGNAL STORES: estado reativo testado por instanciação direta
 * ============================================================================
 *
 * POR QUÊ?
 * `UserSelectionStore` é um "mini-gerenciador de estado" feito com signals.
 * Assim como o OrderDraftModel, é uma classe simples SEM injeção de
 * dependências → `new UserSelectionStore()` e pronto, sem TestBed.
 *
 * O DIFERENCIAL didático deste arquivo: como assertar VALORES COMPUTADOS
 * (computed). Um computed é derivado de outro signal — para testá-lo você
 * não faz nada especial: altera a fonte (select/reset) e lê o computado
 * logo em seguida. A reatividade do Angular resolve o resto sincronamente.
 *
 * O QUE este store garante para a aplicação?
 *   - selectedUsers(): lista de usuários marcados para dividir a conta;
 *   - hasUserSelected(): flag derivada usada para habilitar o botão de salvar.
 * ============================================================================
 */
import { UserSelectionStore } from './user-selection.store';
import { User } from 'app/features/user-registration/models/user.model';

const userA: User = { id: 'a', name: 'Ana' };
const userB: User = { id: 'b', name: 'Bruno' };

describe('UserSelectionStore', () => {
  let store: UserSelectionStore;

  beforeEach(() => {
    // Estado novo por teste: signals guardam valores entre chamadas, então
    // reutilizar a instância contaminaria os resultados.
    store = new UserSelectionStore();
  });

  it('inicia sem seleção', () => {
    // Ler signal = chamar como função. selectedUsers() devolve o array atual;
    // toEqual([]) confirma que começa vazio, não undefined/null.
    expect(store.selectedUsers()).toEqual([]);
    expect(store.hasUserSelected()).toBe(false);
  });

  it('select substitui a seleção (não acumula)', () => {
    /**
     * Detalhe de comportamento fácil de errar: se select() fizesse push,
     * selecionar duas vezes duplicaria usuários. O teste documenta que a
     * intenção é SUBSTITUIR (set), comportamento do qual o componente pai
     * depende para sincronizar checkboxes.
     */
    store.select([userA]);
    store.select([userA, userB]);
    expect(store.selectedUsers()).toEqual([userA, userB]);
  });

  it('select([]) desmarca tudo', () => {
    store.select([userA]);

    store.select([]);

    expect(store.selectedUsers()).toEqual([]);
    expect(store.hasUserSelected()).toBe(false);
  });

  it('hasUserSelected é derivado da seleção', () => {
    /**
     * Testando o COMPUTED: mudamos a fonte (select/reset) e observamos a
     * derivação mudar junto. Se alguém trocar `length > 0` por uma lógica
     * quebrada, este teste pega na hora — sem precisar de componente.
     */
    store.select([userA]);
    expect(store.hasUserSelected()).toBe(true);

    store.reset();
    expect(store.hasUserSelected()).toBe(false);
  });
});
