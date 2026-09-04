import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FinalOrder, Order } from 'app/core/models/order.model';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SessionService } from 'app/shared/services/session.service';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { OrderService } from '../order/services/order.service';
import { CurrencyPipe } from 'app/shared/pipes/currency.pipe';
import { ItemsQuantityComponent } from './items-quantity/items-quantity.component';
import { CardItemsOrderComponent } from './card-items-order/card-items-order.component';
import { ModalQuantityComponent } from './modal-quantity/modal-quantity.component';
import { sumTotalOrders } from '../order/utils/order-calculator';
import { createSummaryForm } from './summary-form/summary-form-factory';
import { SummaryFormControls } from './models/summary-form.interface';
import { SummaryFormComponent } from './summary-form/summary-form.component';
import { toSignal } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
  imports: [
    ButtonComponent,
    CurrencyPipe,
    ReactiveFormsModule,
    ItemsQuantityComponent,
    CardItemsOrderComponent,
    ModalQuantityComponent,
    SummaryFormComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryComponent implements OnInit {
  // inject() permite usar o service já na inicialização dos campos.
  // Com constructor(){} os campos rodam ANTES do construtor → this.orderService seria undefined.
  private readonly orderService = inject(OrderService);
  private readonly sessionService = inject(SessionService);
  private readonly router = inject(Router);

  readonly summaryForm: FormGroup<SummaryFormControls> = createSummaryForm();
  // 1) Observable do form → signal. Form controla "o que é", nós declaramos o valor padrão.
  readonly percent = toSignal(this.summaryForm.controls.percent.valueChanges, {
    initialValue: this.summaryForm.controls.percent.value
  });

  // 2) Referência direta ao signal do service (sem getter)
  readonly orders = this.orderService.orders$;

  // 3) computed: só recalcula quando orders OU percent mudam. Sem efeito colateral, sem CD.
  readonly total = computed(() => sumTotalOrders(this.orders(), this.percent()));
  isOpenModal = signal<boolean>(false);
  orderToEdit = signal<Order | null>(null);

  ngOnInit(): void {
    this.isOrderEmpty();
  }

  isOrderEmpty() {
    if (this.orders().length === 0) {
      this.router.navigate(['registrar']);
    }
  }

  setOrderToEdit(order: Order): void {
    this.orderToEdit.set(order);
    this.openDialog();
  }

  openDialog(): void {
    this.isOpenModal.set(true);
  }

  closeDialog() {
    this.isOpenModal.set(false);
  }

  updateQuantity(newQuantity: number): void {
    const current = this.orderToEdit();
    if (!current) return;
    this.orderService.editOrder({ ...current, quantity: newQuantity });
    this.closeDialog();
  }

  goToOrder() {
    this.router.navigate(['/orders']);
  }

  saveFinalOrder() {
    const finalOrder: FinalOrder = {
      orders: this.orders(),
      tax: this.percent()
    };
    this.orderService.addFinalOrder(finalOrder);
  }

  navigateTo() {
    this.saveFinalOrder();
    this.router.navigate(['divisao-pedido']);
  }
}
