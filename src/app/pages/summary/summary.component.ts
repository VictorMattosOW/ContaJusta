import { Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FinalOrder, Order } from 'src/app/shared/models/order.model';
import { SessionService } from 'src/app/shared/services/session.service';
import { AbstractComponent } from 'src/app/shared/utils/abstract.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserServiceService } from 'src/app/shared/services/user-service.service';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent extends AbstractComponent implements OnInit{
  @ViewChild('dialog') dialogElement!: ElementRef<HTMLDialogElement>;

  orderToEdit = {} as Order;
  orders: Order[] = [];
  totalOrders: number;
  orderForm: FormGroup;
  maxNumberOfUsersInDisplay: number;

  constructor(
    private sessionService: SessionService,
    private userServices: UserServiceService,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getOrders();
    this.buildForm();
    this.maxNumberOfUsersInDisplay = this.userServices.maxNumberOfUsersInDisplayValue;
  }

  getFormattedUserNamesForDisplay(users: User[]): string {
    return this.userServices.getConcatenatedUserNames(users);
  }

  getMaxNumberOfUsersInDisplay(users: User[]): User[] {
    return this.userServices.getMaxNumberOfUsersInDisplay(users);
  }

  buildForm() {
    this.orderForm = new FormGroup({
      percent: new FormControl(10, [
        Validators.maxLength(3),
      ]),
    });
  }

  getOrders() {
    this.sessionService.getOrdersObservable().subscribe({
      next: (orders: Order[]) => {
        this.orders = orders;
        this.isOrderEmpty();
      },
    })
  }

  isOrderEmpty() {
    if(this.orders.length === 0) {
      this.router.navigate(['registrar']);
    }
  }

  calcularValorFinal(valorInicial: number, porcentagem: number): number {
    return valorInicial + (valorInicial * porcentagem / 100);
  }

  sumTotalOrders(): number {
    const percentValue = this.orderForm.value.percent;
    // const percent = percentValue === 0 ? 1 : percentValue;
    this.totalOrders = this.orders.reduce((sum, order) => {
      return sum + this.calcularValorFinal(this.multiplyValues(order.quantity, order.price), percentValue) ;
    }, 0)
    return this.totalOrders;
  }

  deleteOrder(orderToDelete?: Order) {
    this.orders = this.orders.filter((order) => order.id !== orderToDelete.id);
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
    }
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
