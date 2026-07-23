import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Order } from 'app/core/models/order.model';
import { APP_CONSTANTS } from 'app/shared/constants/app.constants';

@Component({
  selector: 'app-card-orders',
  templateUrl: './card-orders.component.html',
  styleUrls: ['./card-orders.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardOrdersComponent {
  @Input() orders: Order[] = [];
  @Output() orderToDelete = new EventEmitter<Order>();

  readonly constants = APP_CONSTANTS;
  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }

  deleteItem(orderToDelete: Order) {
    this.orderToDelete.emit(orderToDelete);
  }
}
