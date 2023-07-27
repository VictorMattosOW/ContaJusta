import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Order, OrderPerUser } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor() {}

  calculateConsumption(
    users: User[],
    orders: Order[],
    tax: number
  ): OrderPerUser[] {
    if (users && orders) {
      // Cria um objeto para armazenar os valores consumidos por cada pessoa
      const consumptionMap = {};
      users.forEach((user) => {
        consumptionMap[user.id] = {
          name: user.name,
          totalValue: 0,
          orders: [],
        };
      });

      // Calcula o valor consumido por cada pessoa em cada pedido
      orders.forEach((order) => {
        const { price, quantity, sharedUsers } = order;
        const totalValueWithTax = price * quantity * (1 + tax / 100);

        // Divide o valor total com a taxa igualmente entre todas as pessoas
        const equalValue =
          Math.floor((totalValueWithTax / sharedUsers.length) * 100) / 100;

        // Calcula o valor total dos valores iguais
        const totalEqualValue = equalValue * sharedUsers.length;

        // Calcula o valor restante para ajustar o último usuário
        const remainder = (totalValueWithTax - totalEqualValue).toFixed(2);

        sharedUsers.forEach((user, index) => {
          // Verifica se é o último usuário
          if (index === sharedUsers.length - 1) {
            consumptionMap[user.id].totalValue +=
              Number(remainder) + equalValue;
            consumptionMap[user.id].orders.push({
              food: order.name,
              sharedValue: Number(remainder),
            });
          } else {
            consumptionMap[user.id].totalValue += equalValue;
            consumptionMap[user.id].orders.push({
              food: order.name,
              sharedValue: equalValue,
            });
          }
        });
      });

      // Retorna o array de objetos no formato desejado
      const result: OrderPerUser[] = Object.values(consumptionMap);
      return result;
    }

    return null;
  }

  calcularValorFinal(valorInicial: number, porcentagem: number): number {
    const valorFinal = valorInicial + (valorInicial * porcentagem) / 100;
    return valorFinal;
  }

  multiplyValues(quantity: number, price: number): number {
    return quantity * price;
  }

  sumTotalOrders(orders: Order[] = [], percent: number = 1): number {
    // const percent = (this.orderForm.value.percent < 1) ? 1 : this.orderForm.value.percent;
    const totalOrders = orders.reduce((sum, order) => {
      return (
        sum +
        this.calcularValorFinal(
          this.multiplyValues(order.quantity, order.price),
          percent
        )
      );
    }, 0);
    return totalOrders;
  }
}
