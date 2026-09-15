import { Component, OnInit, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { CurrencyPipe } from 'app/shared/pipes/currency.pipe';
import { UserService } from 'app/shared/services/user/user.service';
import { DivisionCardComponent } from './division-card/division-card.component';

@Component({
  selector: 'app-order-division',
  templateUrl: './order-division.component.html',
  styleUrls: ['./order-division.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [RouterLink, CurrencyPipe, ButtonComponent, DivisionCardComponent]
})
export class OrderDivisionComponent implements OnInit {
  id = input<string>();

  private readonly userService = inject(UserService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  readonly users = this.userService.users$;
  readonly orders = this.orderService.orders$;
  readonly finalOrder = this.orderService.finalOrder$;
  private readonly orderPerUserResponse = this.orderService.orderPerUser$;

  readonly finalValue = computed<number>(() => this.orderPerUserResponse()?.total ?? 0);
  readonly orderPerUser = this.orderService.orderPerUsers(this.id);

  cardState: boolean[] = [];

  ngOnInit(): void {
    if (!this.id) {
      this.getUsers();
    }
  }

  getUsers() {
    if (this.users().length === 0) {
      this.router.navigate(['registrar']);
    }
  }

  openCard(index: number) {
    this.cardState[index] = !this.cardState[index];
  }
}
