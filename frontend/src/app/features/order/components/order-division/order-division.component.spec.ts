import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';

import { OrderDivisionComponent } from './order-division.component';
import { OrderService, OrderCalculatedResponse } from '../../services/order.service';
import { UserService } from 'app/shared/services/user/user.service';
import { FinalOrder, Order, OrderPerUser } from 'app/features/order/models/order.model';
import { User } from 'app/features/user-registration/models/user.model';

describe('OrderDivisionComponent', () => {
  let component: OrderDivisionComponent;
  let fixture: ComponentFixture<OrderDivisionComponent>;

  let routerMock: { navigate: jest.Mock };
  let usersSignal: WritableSignal<User[]>;
  let ordersSignal: WritableSignal<Order[]>;
  let finalOrderSignal: WritableSignal<FinalOrder>;
  let orderPerUserSignal: WritableSignal<OrderCalculatedResponse | null>;

  const ana: User = { id: 'a', name: 'Ana' };
  const bruno: User = { id: 'b', name: 'Bruno' };
  const pizza: Order = { id: 'o1', name: 'Pizza', quantity: 1, price: 100, sharedUsers: [ana] };
  const responseFalsa: OrderCalculatedResponse = {
    ordersPerUser: [
      { userId: 'a', name: 'Ana', totalValue: 55, orders: [{ orderId: 'o1', food: 'Pizza', sharedValue: 55 }] }
    ] as OrderPerUser[],
    total: 123.45
  };

  const createComponent = () => {
    fixture = TestBed.createComponent(OrderDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    routerMock = { navigate: jest.fn() };
    usersSignal = signal<User[]>([ana, bruno]);
    ordersSignal = signal<Order[]>([pizza]);
    finalOrderSignal = signal<FinalOrder>({ orders: [pizza], tax: 10, users: [ana, bruno], groupName: '' });
    orderPerUserSignal = signal<OrderCalculatedResponse | null>(responseFalsa);

    await TestBed.configureTestingModule({
      imports: [OrderDivisionComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: UserService, useValue: { users$: usersSignal.asReadonly() } },
        {
          provide: OrderService,
          useValue: {
            orders$: ordersSignal.asReadonly(),
            finalOrder$: finalOrderSignal.asReadonly(),
            orderPerUser$: orderPerUserSignal.asReadonly()
          }
        }
      ]
    }).compileComponents();
  });

  it('deve criar e expor a resposta de divisão calculada', () => {
    createComponent();

    expect(component).toBeTruthy();
    expect(component.orderPerUser()).toEqual(responseFalsa.ordersPerUser);
    expect(component.finalValue()).toBe(123.45);
  });

  describe('guarda de navegação (dados ausentes)', () => {
    it('deve redirecionar para /registrar quando a lista de usuários vem vazia', () => {
      usersSignal.set([]);

      createComponent();

      expect(routerMock.navigate).toHaveBeenCalledWith(['registrar']);
    });
  });

  describe('interações da tela', () => {
    beforeEach(() => createComponent());

    it('openCard deve alternar o estado aberto/fechado do cartão', () => {
      expect(component.cardState[0]).toBeUndefined();

      component.openCard(0);
      expect(component.cardState[0]).toBe(true);

      component.openCard(0);
      expect(component.cardState[0]).toBe(false);
    });

    it('goToSummary deve navegar para /resumo', () => {
      component.goToSummary();

      expect(routerMock.navigate).toHaveBeenCalledWith(['resumo']);
    });

    it('goToEventName deve navegar para /evento', () => {
      component.goToEventName();

      expect(routerMock.navigate).toHaveBeenCalledWith(['evento']);
    });
  });
});
