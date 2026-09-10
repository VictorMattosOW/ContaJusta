import { Component, OnInit, ChangeDetectionStrategy, computed, inject } from '@angular/core';
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
  readonly finalOrder = this.orderService.finalOrder$;
  private readonly orderPerUserResponse = this.orderService.orderPerUser$;
  readonly orderPerUser = computed<OrderPerUser[] | null>(() => this.orderPerUserResponse()?.ordersPerUser ?? null);
  readonly finalValue = computed<number>(() => this.orderPerUserResponse()?.total ?? 0);

  cardState: boolean[] = [];

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    if (this.users().length === 0) {
      this.router.navigate(['registrar']);
    }
  }

  openCard(index: number) {
    this.cardState[index] = !this.cardState[index];
  }

  goToSummary() {
    this.router.navigate(['resumo']);
  }

  goToEventName() {
    this.router.navigate(['history']);
  }
}
