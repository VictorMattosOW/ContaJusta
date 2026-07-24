import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';
import { Order } from 'app/core/models/order.model';
import { User } from 'app/core/models/user.model';

describe('OrderService', () => {
  let service: OrderService;

  const user1: User = { id: '1', name: 'João' };
  const user2: User = { id: '2', name: 'Maria' };
  const user3: User = { id: '3', name: 'Ana' };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sumTotalOrders', () => {
    it('should return 0 for empty orders', () => {
      expect(service.sumTotalOrders([], 0)).toBe(0);
    });

    it('should return total without tax when porcent=0', () => {
      const orders: Order[] = [{ id: '1', name: 'Pizza', quantity: 2, price: 50, sharedUsers: [user1] }];
      expect(service.sumTotalOrders(orders, 0)).toBe(100);
    });

    it('should return total with 10% tax', () => {
      const orders: Order[] = [{ id: '1', name: 'Pizza', quantity: 1, price: 100, sharedUsers: [user1] }];
      expect(service.sumTotalOrders(orders, 10)).toBe(110);
    });

    it('should sum multiple orders', () => {
      const orders: Order[] = [
        { id: '1', name: 'Pizza', quantity: 1, price: 100, sharedUsers: [user1] },
        { id: '2', name: 'Suco', quantity: 2, price: 50, sharedUsers: [user1] }
      ];
      expect(service.sumTotalOrders(orders, 0)).toBe(200);
    });
  });

  describe('calculateConsumption', () => {
    it('should return users with zero total when no orders', () => {
      const users: User[] = [user1, user2];
      const result = service.calculateConsumption(users, [], 0);
      console.log(result);
      expect(result.length).toBe(0);
      expect(result).toEqual([]);
    });

    it('should distribute order equally between 2 users', () => {
      const users: User[] = [user1, user2];
      const orders: Order[] = [{ id: '1', name: 'Pizza', quantity: 1, price: 100, sharedUsers: [user1, user2] }];

      const result = service.calculateConsumption(users, orders, 0);

      expect(result.length).toBe(2);

      const joao = result.find((r) => r.name === 'João');
      const maria = result.find((r) => r.name === 'Maria');

      expect(joao?.totalValue).toBe(50);
      expect(maria?.totalValue).toBe(50);
      expect(joao?.orders.length).toBe(1);
      expect(joao?.orders[0].food).toBe('Pizza');
      expect(joao?.orders[0].sharedValue).toBe(50);
    });

    it('should handle remainder correctly (3 users)', () => {
      const users: User[] = [user1, user2, user3];
      const orders: Order[] = [{ id: '1', name: 'Pizza', quantity: 1, price: 100, sharedUsers: [user1, user2, user3] }];

      const result = service.calculateConsumption(users, orders, 0);

      const joao = result.find((r) => r.name === 'João');
      const maria = result.find((r) => r.name === 'Maria');
      const ana = result.find((r) => r.name === 'Ana');

      // 100 / 3 = 33.333... → equalValue = 33.33, remainder = 0.01
      expect(joao?.totalValue).toBeCloseTo(33.33, 2);
      expect(maria?.totalValue).toBeCloseTo(33.33, 2);
      // Ana gets the remainder: 33.33 + 0.01 = 33.34
      expect(ana?.totalValue).toBeCloseTo(33.34, 2);

      // Total should be exactly 100
      const total = result.reduce((sum, r) => sum + r.totalValue, 0);
      expect(total).toBeCloseTo(100, 2);
    });

    it('should apply tax to calculation', () => {
      const users: User[] = [user1, user2];
      const orders: Order[] = [{ id: '1', name: 'Pizza', quantity: 1, price: 100, sharedUsers: [user1, user2] }];

      // 100 * (1 + 10/100) = 110, divided by 2 = 55
      const result = service.calculateConsumption(users, orders, 10);

      const joao = result.find((r) => r.name === 'João');
      const maria = result.find((r) => r.name === 'Maria');

      expect(joao?.totalValue).toBe(55);
      expect(maria?.totalValue).toBe(55);
    });

    it('should handle multiple orders', () => {
      const users: User[] = [user1, user2];
      const orders: Order[] = [
        { id: '1', name: 'Pizza', quantity: 1, price: 100, sharedUsers: [user1, user2] },
        { id: '2', name: 'Suco', quantity: 2, price: 30, sharedUsers: [user1, user2] }
      ];

      const result = service.calculateConsumption(users, orders, 0);

      const joao = result.find((r) => r.name === 'João');

      // Pizza: 100 / 2 = 50
      // Suco: 60 / 2 = 30
      // Total: 80
      expect(joao?.totalValue).toBe(80);
      expect(joao?.orders.length).toBe(2);
    });
  });
});
