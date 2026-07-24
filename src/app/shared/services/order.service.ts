import { Injectable } from '@angular/core';
import { Order, OrderPerUser } from 'app/core/models/order.model';
import { User } from 'app/core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  calculateConsumption(users: User[], orders: Order[], tax: number): OrderPerUser[] {
    if (orders.length === 0) return [];
    if (users && orders) {
      const consumptionMap: Record<string, OrderPerUser> = this.buildInitialMap(users);
      const result: OrderPerUser[] = Object.values(this.distributeOrder(orders, tax, consumptionMap));
      return result;
    }

    return [];
  }

  private distributeOrder(
    orders: Order[],
    tax: number,
    consumptionMap: Record<string, OrderPerUser>
  ): Record<string, OrderPerUser> {
    return orders.reduce((map, order) => {
      const totalValueWithTax = order.price * order.quantity * (1 + tax / 100);
      return this.distributeOrderValue(order, totalValueWithTax, map);
    }, consumptionMap);
  }

  // private distributeOrder(
  //   orders: Order[],
  //   tax: number,
  //   consumptionMap: Record<string, OrderPerUser>
  // ): Record<string, OrderPerUser> {
  //   orders.forEach((order) => {
  //     const { price, quantity } = order;
  //     const totalValueWithTax = price * quantity * (1 + tax / 100);
  //     this.distributeValue(order, totalValueWithTax, consumptionMap);
  //   });

  //   return consumptionMap;
  // }

  private distributeOrderValue(
    order: Order,
    totalValueWithTax: number,
    map: Record<string, OrderPerUser>
  ): Record<string, OrderPerUser> {
    const equalValue = Math.floor((totalValueWithTax / order.sharedUsers.length) * 100) / 100;
    const totalEqualValue = equalValue * order.sharedUsers.length;
    const remainder = Number((totalValueWithTax - totalEqualValue).toFixed(2));

    return order.sharedUsers.reduce((acc, user, index) => {
      const isLastUser = index === order.sharedUsers.length - 1;
      const userValue = isLastUser ? remainder + equalValue : equalValue;
      acc[user.id].totalValue += userValue;
      acc[user.id].orders.push({ food: order.name, sharedValue: userValue });
      return acc;
    }, map);
  }

  private buildInitialMap(users: User[]): Record<string, OrderPerUser> {
    const consumptionMap: Record<string, OrderPerUser> = {};
    users.forEach((user) => {
      consumptionMap[user.id] = {
        name: user.name,
        totalValue: 0,
        orders: []
      };
    });
    return consumptionMap;
  }

  private applyTax(value: number, taxPercent: number): number {
    const valorFinal = value + (value * taxPercent) / 100;
    return valorFinal;
  }

  sumTotalOrders(orders: Order[] = [], porcent = 0): number {
    const totalOrders = orders.reduce((sum, order) => {
      return sum + this.applyTax(order.quantity * order.price, porcent);
    }, 0);
    return totalOrders;
  }
}
