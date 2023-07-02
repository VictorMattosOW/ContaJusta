import { Pipe, PipeTransform } from '@angular/core';
import { Order } from '../models/order.model';

@Pipe({
  name: 'currency'
})
export class CurrencyPipe implements PipeTransform {
  transform(value: number): string {
    // Verifica se o valor é válido
    if (isNaN(value)) {
      return '';
    }

    // Formata o valor como uma máscara de moeda real
    const formattedValue = value.toFixed(2).replace('.', ',');
    return `R$ ${formattedValue}`;
  }

}
