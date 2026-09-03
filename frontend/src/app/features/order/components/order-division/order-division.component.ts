import { Component, AfterViewInit, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FinalOrder, OrderPerUser, SharedFood } from 'app/core/models/order.model';
import { User } from 'app/core/models/user.model';
import { SessionService } from 'app/shared/services/session.service';
import { Subject, takeUntil } from 'rxjs';
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
export class OrderDivisionComponent implements AfterViewInit, OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  usersList: User[] = [];
  finalOrder: FinalOrder = {} as FinalOrder;
  orderPerUser: OrderPerUser[] = [];
  cardState: boolean[] = [];
  finalValue = 0;

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private orderService: OrderService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.getFinalOrder();
  }

  get users() {
    return this.userService.users$();
  }

  ngAfterViewInit() {
    this.changeBackground('blue');
  }

  trackByOrderKey(index: number, sharedFood: SharedFood): string {
    return sharedFood.orderId;
  }

  changeBackground(color = 'white') {
    setTimeout(() => {
      this.sessionService.setBackgroundColor(color);
    }, 0);
  }

  getFinalOrder() {
    this.sessionService
      .getFinalOrderObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (finalOrder: FinalOrder) => {
          this.finalOrder = finalOrder;
          // Interrompe o fluxo quando não há pedido: evita crash ao calcular
          if (this.isOrderEmpty()) return;
          this.calculateOrders();
        }
      });
  }

  isOrderEmpty(): boolean {
    if (!this.finalOrder) {
      // this.router.navigate(['registrar']);
      return true;
    }
    return false;
  }

  getUsers() {
    if (this.users.length === 0) {
      this.router.navigate(['registrar']);
    }
  }

  openCard(index: number) {
    this.cardState[index] = this.cardState[index] ? false : true;
  }

  calculateOrders() {
    const { orders, tax } = this.finalOrder;
    this.orderPerUser = this.orderService.calculateConsumption(this.usersList, orders, tax) ?? [];
    this.finalValue = this.orderService.sumTotalOrders(this.finalOrder.orders, this.finalOrder.tax);
  }

  goToSummary() {
    this.router.navigate(['resumo']);
  }

  goToStart() {
    this.router.navigate(['inicio']);
  }

  ngOnDestroy(): void {
    this.sessionService.setBackgroundColor('white');
    this.destroy$.next();
    this.destroy$.complete();
  }
}
