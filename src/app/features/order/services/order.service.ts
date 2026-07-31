import { Injectable, signal, Signal } from '@angular/core';
import { Order, OrderPerUser } from 'app/core/models/order.model';
import { User } from 'app/core/models/user.model';
import {
  calculateConsumption as _calculateConsumption,
  sumTotalOrders as _sumTotalOrders
} from '../utils/order-calculator';
import { OrderFormData } from '../models/order-form.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders = signal<Order[]>([]);
  readonly orders$ = this.orders.asReadonly();

  addOrder(data: OrderFormData, sharedUsers: User[]): Order {
    const order: Order = {
      id: crypto.randomUUID(),
      name: data.foodName,
      price: data.price,
      quantity: data.quantity,
      sharedUsers
    };
    this.orders.update((list) => [...list, order]);
    return order;
  }

  removeOrder(id: string): void {
    this.orders.update(list => list.filter(o => o.id !== id));
  }

  editOrder(data: Order): void {
    this.orders.update(list => list.map(o => o.id === data.id ? { ...o, ...data} : o));
  }

  clearOrder(): void {
    this.orders.set([]);
  }

  calculateConsumption(users: User[], orders: Order[], tax: number): OrderPerUser[] {
    return _calculateConsumption(users, orders, tax);
  }

  sumTotalOrders(orders: Order[], taxPercent = 0): number {
    return _sumTotalOrders(orders, taxPercent);
  }
}
