import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Order } from 'src/app/core/models/order.model';
import { User } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { multiplyValues } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-card-orders',
  templateUrl: './card-orders.component.html',
  styleUrls: ['./card-orders.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardOrdersComponent implements OnInit {
  @Input() orders: Order[] = [];
  @Output() orderToDelete = new EventEmitter<Order>();

  maxNumberOfUsersInDisplay = 0;
  tooltipDisplayStates: boolean[] = [];
  multiplyValues = multiplyValues;
  constructor(private userServices: UserService) {}

  ngOnInit(): void {
    this.maxNumberOfUsersInDisplay = this.userServices.maxNumberOfUsersInDisplayValue;
  }

  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }

  getFormattedUserNamesForDisplay(users: User[]): string {
    return this.userServices.getConcatenatedUserNames(users);
  }

  getMaxNumberOfUsersInDisplay(users: User[]): User[] {
    return this.userServices.getMaxNumberOfUsersInDisplay(users);
  }

  deleteItem(orderToDelete: Order) {
    this.orderToDelete.emit(orderToDelete);
  }

  // TODO: vai vazar daqui
  onHover(index: number) {
    this.tooltipDisplayStates[index] = true; // Define o estado de exibição do tooltip para o item de índice 'index' como true
  }

  // TODO: vai vazar daqui
  onMouseout(index: number) {
    this.tooltipDisplayStates[index] = false; // Define o estado de exibição do tooltip para o item de índice 'index' como false
  }
}
