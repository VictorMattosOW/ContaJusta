import { Order, OrderPerUser, SharedFood } from 'app/core/models/order.model';
import { User } from 'app/core/models/user.model';

export function applyTax(value: number, taxPercent: number): number {
  const finalValue = value + (value * taxPercent) / 100;
  return finalValue;
}

function buildInitialMap(users: User[]): Map<string, OrderPerUser> {
  const consumptionMap = new Map<string, OrderPerUser>();
  users.forEach((user) => {
    const entryUser: OrderPerUser = {
      userId: user.id,
      name: user.name,
      totalValue: 0,
      orders: []
    };
    consumptionMap.set(user.id, entryUser);
  });
  return consumptionMap;
}

function distributeOrderValue(
  order: Order,
  totalValueWithTax: number,
  map: Map<string, OrderPerUser>
): Map<string, OrderPerUser> {
  if (!order.sharedUsers.length) {
    throw new Error(`Order ${order.id} has no shared users`);
  }
  const equalValue = Math.floor((totalValueWithTax / order.sharedUsers.length) * 100) / 100;
  const totalEqualValue = equalValue * order.sharedUsers.length;
  const remainder = Number((totalValueWithTax - totalEqualValue).toFixed(2));

  return order.sharedUsers.reduce((acc, user, index) => {
    const isLastUser = index === order.sharedUsers.length - 1;
    const userValue = isLastUser ? remainder + equalValue : equalValue;
    const orderEntry: SharedFood = { orderId: order.id, food: order.name, sharedValue: userValue };
    const orderPerUser = acc.get(user.id);

    if (!orderPerUser) {
      throw new Error(`User ${user.id} not found in consumption map`);
    }

    const orderPer: OrderPerUser = {
      userId: user.id,
      totalValue: orderPerUser.totalValue + userValue,
      name: orderPerUser.name,
      orders: [...orderPerUser.orders, orderEntry]
    };
    acc.set(user.id, orderPer);
    return acc;
  }, map);
}

function distributeOrder(
  orders: Order[],
  tax: number,
  consumptionMap: Map<string, OrderPerUser>
): Map<string, OrderPerUser> {
  return orders.reduce((map, order) => {
    const totalValueWithTax = order.price * order.quantity * (1 + tax / 100);
    return distributeOrderValue(order, totalValueWithTax, map);
  }, consumptionMap);
}

export function sumTotalOrders(orders: Order[] = [], taxPercent = 0): number {
  const totalOrders = orders.reduce((sum, order) => {
    return sum + applyTax(order.quantity * order.price, taxPercent);
  }, 0);
  return totalOrders;
}

export function calculateConsumption(users: User[], orders: Order[], tax: number): OrderPerUser[] {
  if (!orders?.length || !users?.length) return [];
  if (tax < 0) throw new Error('Taxa não pode ser menor que 0');

  const consumptionMap = buildInitialMap(users);
  const result: OrderPerUser[] = Array.from(distributeOrder(orders, tax, consumptionMap).values());
  return result;
}
