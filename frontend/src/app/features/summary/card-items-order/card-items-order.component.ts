import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Order } from 'app/features/order/models/order.model';
import { CurrencyPipe } from 'app/shared/pipes/currency.pipe';
import { UserNamesDisplayPipe } from 'app/shared/pipes/user-names-display.pipe';

@Component({
  imports: [UserNamesDisplayPipe, RouterLink, CurrencyPipe],
  selector: 'app-card-items-order',
  styleUrl: './card-items-order.component.css',
  templateUrl: './card-items-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardItemsOrderComponent {
  orders = input<Order[]>([]);
  orderToEdit = output<Order>();

  openDialog(order: Order) {
    this.orderToEdit.emit(order);
  }
}
