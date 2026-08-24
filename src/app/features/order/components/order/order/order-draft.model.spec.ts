import { OrderDraftModel } from './order-draft.model';
import { Order } from 'app/core/models/order.model';
import { User } from 'app/core/models/user.model';

const userA: User = { id: 'a', name: 'Ana' };
const order: Order = { id: 'o1', name: 'Pizza', price: 30, quantity: 2, sharedUsers: [userA] };

describe('OrderDraftModel', () => {
  let draft: OrderDraftModel;

  beforeEach(() => {
    draft = new OrderDraftModel();
  });

  it('começa em modo criação, form vazio e válido', () => {
    expect(draft.isEdit()).toBe(false);
    expect(draft.buildCreatePayload()).toEqual({ foodName: '', price: 0, quantity: 1 });
  });

  it('startEditing(undefined) não ativa edição', () => {
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
    expect(payload).toEqual({ id: 'o1', name: 'Calzone', price: 35, quantity: 2, sharedUsers: [userA] });
  });

  it('buildEditPayload retorna null fora do modo edição', () => {
    expect(draft.buildEditPayload([userA])).toBeNull();
  });

  it('reset volta ao estado inicial', () => {
    draft.startEditing(order);
    draft.reset();
    expect(draft.isEdit()).toBe(false);
    expect(draft.form.value).toEqual({ foodName: '', price: 0, quantity: 1 });
  });
});
