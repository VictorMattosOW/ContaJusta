import { Order } from "../models/order.model";

export abstract class AbstractComponent {
  constructor() {}

  getSharedUserNames(order: Order): string {
    return order.sharedUsers.map((user) => user.name).join(', ');
  }

  multiplyValues(quantity: number, price: number): number {
    return quantity * price;
  }
}
