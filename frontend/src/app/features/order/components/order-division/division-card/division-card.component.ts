import { Component, input, output } from '@angular/core';
import { OrderPerUser } from 'app/features/order/models/order.model';
import { CurrencyPipe } from 'app/shared/pipes/currency.pipe';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-division-card',
  styleUrl: './division-card.component.css',
  templateUrl: './division-card.component.html'
})
export class DivisionCardComponent {
  orderPerUser = input.required<OrderPerUser>();
  cardState = input.required<boolean>();
  openCard = output<void>();

  handleOpenCard() {
    this.openCard.emit();
  }
}
