/**
 * ============================================================================
 * TESTE 4 — CLASSES DE MODELO: instanciação direta, sem TestBed
 * ============================================================================
 *
 * POR QUÊ?
 * `OrderDraftModel` é uma classe TypeScript comum (não é @Injectable nem
 * @Component). Ela agrupa estado do formulário + modo edição. Como não tem
 * dependências injetáveis, o TestBed seria puro desperdício: basta dar
 * `new OrderDraftModel()` e testar seus métodos.
 *
 * REGRA PRÁTICA para decidir a abordagem:
 *   função pura / classe sem DI ......... importe e instancie (este arquivo)
 *   serviço @Injectable com DI .......... TestBed.inject() (order.service.spec)
 *   componente com template ............. TestBed.createComponent() (specs de UI)
 *
 * O QUE vale a pena observar num modelo como este?
 *   - transições de estado: criar → editar → resetar (cada teste cobre uma);
 *   - casos-limite de entrada: startEditing(undefined) NÃO deve ativar edição;
 *   - o payload final: buildEditPayload deve MESCLAR pedido original com o
 *     que foi digitado — erros de spread/ordem aqui corrompem o id do pedido!
 * ============================================================================
 */
import { OrderDraftModel } from './order-draft.model';
import { Order } from 'app/features/order/models/order.model';
import { User } from 'app/features/user-registration/models/user.model';

const userA: User = { id: 'a', name: 'Ana' };
const order: Order = { id: 'o1', name: 'Pizza', price: 30, quantity: 2, sharedUsers: [userA] };

describe('OrderDraftModel', () => {
  let draft: OrderDraftModel;

  beforeEach(() => {
    // Instância nova por teste — mesmo princípio do TestBed.resetTestingModule,
    // só que manual, porque aqui não há framework gerenciando o ciclo.
    draft = new OrderDraftModel();
  });

  it('começa em modo criação, form vazio e válido', () => {
    expect(draft.isEdit()).toBe(false);
    expect(draft.buildCreatePayload()).toEqual({ foodName: '', price: 0, quantity: 1 });
  });

  it('startEditing(undefined) não ativa edição', () => {
    /**
     * Caso-limite importante na prática: a rota de edição pode receber um id
     * que não existe mais (pedido excluído). Nesse cenário o modelo deve
     * permanecer em MODO CRIAÇÃO e não quebrar — este teste trava esse
     * comportamento defensivo.
     */
    draft.startEditing(undefined);
    expect(draft.isEdit()).toBe(false);
  });

  it('startEditing preenche o form e ativa edição', () => {
    draft.startEditing(order);

    expect(draft.isEdit()).toBe(true);
    expect(draft.form.value).toEqual({ foodName: 'Pizza', price: 30, quantity: 2 });
  });

  it('buildEditPayload mescla pedido original com form e usuários', () => {
    draft.startEditing(order);
    draft.form.patchValue({ foodName: 'Calzone', price: 35 });

    const payload = draft.buildEditPayload([userA]);

    /**
     * toEqual faz comparação PROFUNDA (deep equality), ignorando referências
     * de objeto. Se amanhã alguém esquecer o spread `...order` no método,
     * o id 'o1' sumirá do payload e ESTE teste falhará — exatamente o bug
     * que queremos capturar antes de chegar ao usuário.
     */
    expect(payload).toEqual({ id: 'o1', name: 'Calzone', price: 35, quantity: 2, sharedUsers: [userA] });
  });

  it('buildEditPayload retorna null fora do modo edição', () => {
    // Sem startEditing antes → não há "pedido original" para mesclar.
    // O null é o contrato que OrderComponent usa para NAVEGAR ou não.
    expect(draft.buildEditPayload([userA])).toBeNull();
  });

  it('reset volta ao estado inicial', () => {
    draft.startEditing(order);

    draft.reset();

    expect(draft.isEdit()).toBe(false);
    expect(draft.form.value).toEqual({ foodName: '', price: 0, quantity: 1 });
  });
});
