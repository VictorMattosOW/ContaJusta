import { Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Order } from 'src/app/shared/models/order.model';
import { SessionService } from 'src/app/shared/services/session.service';
import { AbstractComponent } from 'src/app/shared/utils/abstract.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor(
    private sessionService: SessionService,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getOrders();
    this.buildForm();
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
        if(orders.length === 0) {
          this.router.navigate(['registrar']);
        }
        this.orders = orders;
      },
    })
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
