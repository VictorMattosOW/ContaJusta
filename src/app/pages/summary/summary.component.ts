import { Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { APP_CONSTANTS } from '../../shared/constants/app.constants';
import { FinalOrder, Order } from 'app/core/models/order.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SessionService } from 'app/shared/services/session.service';

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.css'],
    standalone: false
})
export class SummaryComponent implements OnInit {
  @ViewChild('dialog') dialogElement!: ElementRef<HTMLDialogElement>;

  orderToEdit = {} as Order;
  orders: Order[] = [];
  totalOrders = 0;
  orderForm: FormGroup = new FormGroup({
    percent: new FormControl(10, [Validators.maxLength(3)])
  });
  constants = APP_CONSTANTS;

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getOrders();
    this.buildForm();
  }

  buildForm() {
    this.orderForm = new FormGroup({
      percent: new FormControl(10, [Validators.maxLength(3)])
    });
  }

  getOrders() {
    this.sessionService.getOrdersObservable().subscribe({
      next: (orders: Order[]) => {
        this.orders = orders;
        this.isOrderEmpty();
      }
    });
  }

  isOrderEmpty() {
    if (this.orders.length === 0) {
      this.router.navigate(['registrar']);
    }
  }

  calcularValorFinal(valorInicial: number, porcentagem: number): number {
    return valorInicial + (valorInicial * porcentagem) / 100;
  }

  sumTotalOrders(): number {
    const percentValue = this.orderForm.value.percent;
    // const percent = percentValue === 0 ? 1 : percentValue;
    this.totalOrders = this.orders.reduce((sum, order) => {
      return sum + this.calcularValorFinal(order.quantity * order.price, percentValue);
    }, 0);
    return this.totalOrders;
  }

  deleteOrder(orderToDelete?: Order) {
    this.orders = this.orders.filter((order) => order.id !== orderToDelete!.id);
    this.sessionService.setOrders(this.orders);
    this.isOrderEmpty();
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

  goToOrder() {
    this.sessionService.setOrders(this.orders);
    this.router.navigate(['ordens']);
  }

  saveFinalOrder() {
    const finalOrder: FinalOrder = {
      orders: this.orders,
      tax: this.orderForm.value.percent
    };
    this.sessionService.setFinalOrder(finalOrder);
  }

  navigateTo() {
    this.saveFinalOrder();
    this.router.navigate(['divisao-pedido']);
  }

  canEnableButton(): boolean {
    return this.orderToEdit.quantity === 1;
  }

  addQuantity() {
    this.orderToEdit.quantity += 1;
  }

  subtractQuantity() {
    this.orderToEdit.quantity -= 1;
  }
}
