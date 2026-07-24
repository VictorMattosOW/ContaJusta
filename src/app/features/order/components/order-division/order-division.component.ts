import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FinalOrder, OrderPerUser } from 'app/core/models/order.model';
import { User } from 'app/core/models/user.model';
import { SessionService } from 'app/shared/services/session.service';
import { Subject, takeUntil } from 'rxjs';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-division',
  templateUrl: './order-division.component.html',
  styleUrls: ['./order-division.component.css']
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
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.getFinalOrder();
  }

  ngAfterViewInit() {
    this.changeBackground('blue');
  }

  trackByOrderKey(index: number, sharedFood: any): string {
    return `${sharedFood.food}-${sharedFood.sharedValue}`;
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
          this.isOrderEmpty();
          this.calculateOrders();
        }
      });
  }

  isOrderEmpty() {
    if (!this.finalOrder) {
      this.router.navigate(['registrar']);
    }
  }

  getUsers() {
    this.sessionService
      .getUsersObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          if (users.length === 0) {
            this.router.navigate(['registrar']);
          }
          this.usersList = users;
        }
      });
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
    this.destroy$.next();
    this.destroy$.complete();
  }
}
