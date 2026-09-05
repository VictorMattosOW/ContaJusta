import { Injectable, signal } from '@angular/core';
import { FinalOrder, Order, OrderPerUser } from 'app/features/order/models/order.model';
import { User } from 'app/features/user-registration/models/user.model';
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

  private finalOrder = signal<FinalOrder>({
    orders: [],
    tax: 0
  });

  readonly finalOrder$ = this.finalOrder.asReadonly();

  addFinalOrder(finalOrder: FinalOrder) {
    this.finalOrder.set(finalOrder);
  }

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
    this.orders.update((list) => list.filter((o) => o.id !== id));
  }

  editOrder(data: Order): void {
    this.orders.update((list) => list.map((o) => (o.id === data.id ? { ...o, ...data } : o)));
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
