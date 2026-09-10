/**
 * ============================================================================
 * TESTE 11 — COMPONENTE "INTELIGENTE": ISOLAMENTO ENTRE TESTES E ARMADILHAS
 * ============================================================================
 *
 * Este arquivo ensina TRÊS lições importantes de testes de componentes:
 *
 * LIÇÃO 1 — MOCKS NOVOS A CADA TESTE (isolamento):
 * A versão anterior criava `const orderSignal = signal([])` UMA vez, fora do
 * beforeEach. Como signals guardam estado, um teste que fazia set([order])
 * contaminava os seguintes → falhas "fantasmas" que somem quando rodamos o
 * teste sozinho. Regra de ouro: TODO mock nasce dentro do beforeEach.
 *
 * LIÇÃO 2 — PADRÃO HELPER createComponent():
 * Alguns testes precisam configurar coisas ANTES do componente existir (a
 * Lição 3 explica). Se o beforeEach cria/renderiza o componente, isso é
 * impossível. Solução: o beforeEach só prepara mocks/providers; cada teste
 * chama createComponent() na hora que quiser.
 *
 * LIÇÃO 3 — ActivatedRoute.snapshot LÊ UMA ÚNICA VEZ:
 * O componente faz, no ngOnInit:
 *     const orderId = this.route.snapshot.params['id'];
 * O snapshot não é reativo: se o teste mudar params DEPOIS do ngOnInit,
 * nada acontece. Por isso o teste de edição configura routeMock.snapshot.
 * params = { id: 'o1' } ANTES de createComponent(). Era exatamente esse o
 * bug do spec antigo ("Expected true, received false").
 * ============================================================================
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WritableSignal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { OrderComponent } from './order.component';
import { OrderService } from 'app/features/order/services/order.service';
import { UserService } from 'app/shared/services/user/user.service';
import { Order } from 'app/features/order/models/order.model';
import { User } from 'app/features/user-registration/models/user.model';

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;

  // Tipos explícitos dos mocks — ajudam o autocomplete e documentam o uso
  let routerMock: { navigate: jest.Mock };
  let routeMock: { snapshot: { params: Record<string, string> } };
  let ordersSignal: WritableSignal<Order[]>;
  let orderServiceMock: {
    orders$: ReturnType<WritableSignal<Order[]>['asReadonly']>;
    addOrder: jest.Mock;
    editOrder: jest.Mock;
    removeOrder: jest.Mock;
  };

  // Fixtures de dados
  const userA: User = { id: 'a', name: 'Ana' };
  const order: Order = { id: 'o1', name: 'Pizza', price: 30, quantity: 2, sharedUsers: [userA] };

  /** Helper (Lição 2): cria + renderiza. Chame APÓS configurar o cenário. */
  const createComponent = () => {
    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // dispara ngOnInit (lê o snapshot da rota!)
  };

  beforeEach(async () => {
    /**
     * LIÇÃO 1 em ação: nenhum mock é compartilhado entre testes.
     * Cada execução começa com router limpo, rota sem params e signal vazio.
     */
    routerMock = { navigate: jest.fn() };
    routeMock = { snapshot: { params: {} } };
    ordersSignal = signal<Order[]>([]);
    orderServiceMock = {
      orders$: ordersSignal.asReadonly(),
      addOrder: jest.fn(),
      editOrder: jest.fn(),
      removeOrder: jest.fn()
    };
    const usersSignal = signal<User[]>([userA]);

    await TestBed.configureTestingModule({
      imports: [OrderComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        // useValue com objeto próprio: controle TOTAL sobre snapshot.params
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: OrderService, useValue: orderServiceMock },
        { provide: UserService, useValue: { users$: usersSignal.asReadonly() } }
      ]
    }).compileComponents();
  });

  it('deve criar o componente em modo criação por padrão', () => {
    createComponent();

    expect(component).toBeTruthy();
    expect(component.draft.isEdit()).toBe(false);
  });

  it('cria pedido com payload do form e usuários selecionados, depois reseta tudo', () => {
    createComponent();

    component.draft.form.patchValue({ foodName: 'Sushi', price: 50, quantity: 1 });
    component.selection.select([userA]);

    component.createOrder(); // Act

    // 1) Serviço recebeu dados corretos
    expect(orderServiceMock.addOrder).toHaveBeenCalledWith({ foodName: 'Sushi', price: 50, quantity: 1 }, [userA]);
    // 2) Efeitos colaterais: form resetado...
    expect(component.draft.form.value).toEqual({ foodName: '', price: 0, quantity: 1 });
    // 3) ...seleção zerada (o reset dos checkboxes agora vive no store de seleção)
    expect(component.selection.hasUserSelected()).toBe(false);
  });

  it('canCreate acompanha validade do form e seleção de usuários', () => {
    createComponent(); // ngOnInit assina statusChanges

    /**
     * canCreate = form válido E ao menos um usuário selecionado.
     * O form só fica válido quando TODOS os controles estão válidos — por isso
     * cobrimos nome e preço em cada cenário.
     */
    component.draft.form.patchValue({ foodName: '', price: 0 }); // inválido
    expect(component.canCreate()).toBe(false);

    component.draft.form.patchValue({ foodName: 'X', price: 10 }); // válido, mas sem usuário
    expect(component.canCreate()).toBe(false);

    component.selection.select([userA]); // usuário selecionado
    expect(component.canCreate()).toBe(true);
  });

  it('modo edição: preenche form a partir da rota, salva e navega', () => {
    /**
     * LIÇÃO 3 em ação: params e pedidos configurados ANTES de criar o
     * componente, porque ngOnInit consome o snapshot uma única vez.
     */
    routeMock.snapshot.params = { id: 'o1' };
    ordersSignal.set([order]);
    createComponent();

    // O componente entrou em modo edição automaticamente
    expect(component.draft.isEdit()).toBe(true);
    expect(component.draft.form.value).toEqual({ foodName: 'Pizza', price: 30, quantity: 2 });

    // Usuário altera o nome e mantém os usuários que dividem a conta
    // (o payload de edição recebe sharedUsers do store de seleção!)
    component.selection.select([userA]);
    component.draft.form.patchValue({ foodName: 'Calzone' });
    component.editOrder();

    // Payload mesclado: id original + campo alterado
    expect(orderServiceMock.editOrder).toHaveBeenCalledWith({ ...order, name: 'Calzone' });
    expect(routerMock.navigate).toHaveBeenCalledWith(['resumo']);
  });

  it('editOrder NÃO deve fazer nada fora do modo edição (payload null)', () => {
    createComponent(); // sem params → modo criação

    component.editOrder();

    expect(orderServiceMock.editOrder).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('confirmDelete remove o pedido e fecha o modal', () => {
    createComponent();

    component.requestDelete(order); // abre modal pedindo confirmação
    expect(component.isDeleteModalOpen()).toBe(true);

    component.confirmDelete();

    expect(orderServiceMock.removeOrder).toHaveBeenCalledWith('o1');
    expect(component.isDeleteModalOpen()).toBe(false);
    expect(component.orderToDelete()).toBeNull();
  });

  it('confirmDelete apenas fecha o modal se não houver pedido alvo', () => {
    createComponent();

    // Usuário fechou sem escolher pedido: confirmDelete sem alvo
    component.confirmDelete();

    expect(orderServiceMock.removeOrder).not.toHaveBeenCalled();
    expect(component.isDeleteModalOpen()).toBe(false);
  });

  describe('navigateToSummary (guarda de navegação)', () => {
    it('não deve navegar quando não há pedidos', () => {
      createComponent(); // ordersSignal vazio

      component.navigateToSummary();

      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('deve navegar quando existe ao menos um pedido', () => {
      ordersSignal.set([order]); // signal é lido pelo getter getOrder
      createComponent();

      component.navigateToSummary();

      expect(routerMock.navigate).toHaveBeenCalledWith(['resumo']);
    });
  });
});
