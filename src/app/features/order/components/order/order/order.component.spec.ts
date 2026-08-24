import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderComponent } from './order.component';
import { OrderService } from 'app/features/order/services/order.service';
import { UserService } from 'app/shared/services/user/user.service';
import { Order } from 'app/core/models/order.model';
import { User } from 'app/core/models/user.model';

const userA: User = { id: 'a', name: 'Ana' };
const order: Order = { id: 'o1', name: 'Pizza', price: 30, quantity: 2, sharedUsers: [userA] };

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;
  let router: { navigate: jest.Mock };
  let orderService: {
    orders$: ReturnType<typeof signal<Order[]>>;
    addOrder: jest.Mock;
    editOrder: jest.Mock;
    removeOrder: jest.Mock;
  };

  const createOrderSignal = () => signal<Order[]>([]);
  const orderSignal = createOrderSignal();

  const orderServiceMock = {
    orders$: orderSignal.asReadonly(),
    addOrder: jest.fn(),
    editOrder: jest.fn(),
    removeOrder: jest.fn()
  };

  beforeEach(async () => {
    router = { navigate: jest.fn() };
    await TestBed.configureTestingModule({
      imports: [OrderComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
        { provide: OrderService, useValue: orderServiceMock },
        { provide: UserService, useValue: { users$: signal<User[]>([userA]).asReadonly() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('cria pedido com payload do form e usuários selecionados', () => {
    component.draft.form.patchValue({ foodName: 'Sushi', price: 50, quantity: 1 });
    component.selection.select([userA]);

    component.createOrder();

    expect(orderServiceMock.addOrder).toHaveBeenCalledWith(
      { foodName: 'Sushi', price: 50, quantity: 1 },
      [userA]
    );
    expect(component.draft.form.value).toEqual({ foodName: '', price: 0, quantity: 1 });
    expect(component.selection.hasUserSelected()).toBe(false);
  });

  it('isSubmitButton acompanha a validade do form', () => {
    component.draft.form.controls.foodName.setValue('');
    expect(component.isSubmitButton()).toBe(false);
    component.draft.form.controls.foodName.setValue('X');
    expect(component.isSubmitButton()).toBe(true);
  });

  it('modo edição: preenche form, salva e navega', () => {
    orderSignal.set([order]);
    const route = TestBed.inject(ActivatedRoute) as { snapshot: { params: Record<string, string> } };
    route.snapshot.params = { id: 'o1' };
    fixture.detectChanges();

    expect(component.draft.isEdit()).toBe(true);
    expect(component.draft.form.value).toEqual({ foodName: 'Pizza', price: 30, quantity: 2 });

    component.draft.form.patchValue({ foodName: 'Calzone' });
    component.editOrder();

    expect(orderServiceMock.editOrder).toHaveBeenCalledWith({ ...order, name: 'Calzone' });
    expect(router.navigate).toHaveBeenCalledWith(['resumo']);
  });

  it('confirmDelete chama removeOrder e fecha o modal', () => {
    component.requestDelete(order);
    expect(component.isDeleteModalOpen()).toBe(true);

    component.confirmDelete();

    expect(orderServiceMock.removeOrder).toHaveBeenCalledWith('o1');
    expect(component.isDeleteModalOpen()).toBe(false);
    expect(component.orderToDelete()).toBeNull();
  });
});