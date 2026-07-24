import { TestBed } from '@angular/core/testing';
import { Order } from 'app/core/models/order.model';
import { User } from 'app/core/models/user.model';
import { OrderService } from '../services/order.service';

describe('OrderService', () => {
  let service: OrderService;
  const user1: User = { id: '1', name: 'João' };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should delegate calculateConsumption to pure function', () => {
    const orders: Order[] = [{ id: '1', name: 'Pizza', quantity: 1, price: 100, sharedUsers: [user1] }];
    const result = service.calculateConsumption([user1], orders, 0);
    expect(result[0].totalValue).toBe(100);
  });

  it('should delegate sumTotalOrders to pure function', () => {
    const orders: Order[] = [{ id: '1', name: 'Pizza', quantity: 1, price: 100, sharedUsers: [user1] }];
    expect(service.sumTotalOrders(orders, 10)).toBe(110);
  });
});
