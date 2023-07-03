import { Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Order } from 'src/app/shared/models/order.model';
import { SessionService } from 'src/app/shared/services/session.service';
import { AbstractComponent } from 'src/app/shared/utils/abstract.component';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent extends AbstractComponent implements OnInit{
  @ViewChild('dialog') dialogElement!: ElementRef<HTMLDialogElement>;
  orderToEdit = {} as Order;

  orders: Order[] = [];

  constructor(
    private sessionService: SessionService,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.sessionService.getOrdersObservable().subscribe({
      next: (orders: Order[]) => {
        if(orders.length === 0) {
          this.router.navigate(['registrar']);
        }
        this.orders = orders;
      },
    })
  }

  openDialog(order: Order): void {
    this.orderToEdit = order;
    this.dialogElement.nativeElement.show();
  }

  closeDialog(): void {
    this.orders.forEach((order) => {
      if (order.id === this.orderToEdit.id) {
        order = this.orderToEdit;
      }
    });
    this.dialogElement.nativeElement.close();
  }
}
