import { Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Order } from 'src/app/shared/models/order.model';
import { SessionService } from 'src/app/shared/services/session.service';
import { AbstractComponent } from 'src/app/shared/utils/abstract.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderComponent } from '../order/order.component';
import { UserServiceService } from 'src/app/shared/services/user-service.service';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent extends AbstractComponent implements OnInit{
  @ViewChild('dialog') dialogElement!: ElementRef<HTMLDialogElement>;
  @ViewChild('dialogEdit') dialogElementEdit!: ElementRef<HTMLDialogElement>;
  @ViewChild(OrderComponent, { static: false }) appOrder!: OrderComponent;

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
        Validators.min(1),
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
    const valorFinal = valorInicial + (valorInicial * porcentagem / 100);
    return valorFinal;
  }

  sumTotalOrders(): number {
    const percent = (this.orderForm.value.percent < 1) ? 1 : this.orderForm.value.percent;
    this.totalOrders = this.orders.reduce((sum, order) => {
      return sum + this.calcularValorFinal(this.multiplyValues(order.quantity, order.price), percent) ;
    }, 0)
    return this.totalOrders;
  }

  openDialogEdit(order: Order): void {
    if(!!this.appOrder) {
      this.orderToEdit = order;
      this.dialogElementEdit.nativeElement.show();
    }
  }

  closeDialogEdit(): void {
    this.dialogElementEdit.nativeElement.close();
  }

  deleteOrder(orderToDelete?: Order) {
    this.orders = this.orders.filter((order) => order.id !== orderToDelete.id);
    this.sessionService.setOrders(this.orders);
    this.closeDialogEdit();
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
}
