import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OrderPerUser } from 'app/features/order/models/order.model';
import { OrderService } from '../../services/order.service';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { CurrencyPipe } from 'app/shared/pipes/currency.pipe';
import { UserService } from 'app/shared/services/user/user.service';

@Component({
  selector: 'app-order-division',
  templateUrl: './order-division.component.html',
  styleUrls: ['./order-division.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [CurrencyPipe, ButtonComponent]
})
export class OrderDivisionComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  readonly users = this.userService.users$;
  readonly orders = this.orderService.orders$;

  finalOrder = this.orderService.finalOrder$;

  orderPerUser: OrderPerUser[] = [];
  cardState: boolean[] = [];
  finalValue = 0;

  ngOnInit(): void {
    this.getUsers();
    this.calculateOrders();
  }

  isOrderEmpty() {
    if (!this.finalOrder()) {
      this.router.navigate(['registrar']);
    }
  }

  getUsers() {
    if (this.users().length === 0) {
      this.router.navigate(['registrar']);
    }
  }

  openCard(index: number) {
    this.cardState[index] = this.cardState[index] ? false : true;
  }

  calculateOrders() {
    const { orders, tax } = this.finalOrder();
    this.orderPerUser = this.orderService.calculateConsumption(this.users(), orders, tax) ?? [];
    this.finalValue = this.orderService.sumTotalOrders(this.finalOrder().orders, this.finalOrder().tax);
  }

  goToSummary() {
    this.router.navigate(['resumo']);
  }

  goToStart() {
    this.router.navigate(['inicio']);
  }
}
