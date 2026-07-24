import { Injectable } from '@angular/core';
import { Order, OrderPerUser } from 'app/core/models/order.model';
import { User } from 'app/core/models/user.model';
import {
  calculateConsumption as _calculateConsumption,
  sumTotalOrders as _sumTotalOrders
} from '../utils/order-calculator';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  calculateConsumption(users: User[], orders: Order[], tax: number): OrderPerUser[] {
    return _calculateConsumption(users, orders, tax);
  }

  sumTotalOrders(orders: Order[], taxPercent = 0): number {
    return _sumTotalOrders(orders, taxPercent);
  }
}
