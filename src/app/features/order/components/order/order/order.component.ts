import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderFormComponent } from '../order-form/order-form.component';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'app/core/models/user.model';
import { Order } from 'app/core/models/order.model';
import { OrderFormControls } from 'app/features/order/models/order-form.interface';
import { SessionService } from 'app/shared/services/session.service';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { ButtonLinkComponent } from 'app/shared/components/button-link/button-link.component';
import { CardOrdersComponent } from '../card-orders/card-orders.component';
import { UserCheckboxComponent } from '../user-checkbox/user-checkbox.component';
import { ModalComponent } from 'app/shared/components/modal/modal.component';
import { OrderService } from 'app/features/order/services/order.service';
import { FormGroup } from '@angular/forms';
import { createOrderFormGroup } from '../order-form/order-form.factory';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ButtonComponent,
    ButtonLinkComponent,
    OrderFormComponent,
    CardOrdersComponent,
    UserCheckboxComponent,
    ModalComponent
  ]
})
export class OrderComponent implements OnInit, OnDestroy {
  orderForm: FormGroup<OrderFormControls> = createOrderFormGroup();

  readonly isDeleteModalOpen = signal(false);
  readonly orderToDelete = signal<Order | null>(null);
  private readonly destroy$ = new Subject<void>();
  isSubmitButton = signal(false);
  resetCheckbox = signal(0);

  orderToEditOrDelete: Order | undefined = {} as Order;
  usersList = signal<User[]>([]);
  sharedFood = signal<User[]>([]);
  isEdit = signal(false);
  hasUserSelected = signal(false);

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.getPath();
    this.orderForm.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.isSubmitButton.set(this.orderForm.valid));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  requestDelete(order: Order): void {
    this.orderToDelete.set(order);
    this.isDeleteModalOpen.set(true);
  }

  get getOrder(): Order[] {
    return this.orderService.orders$();
  }

  confirmDelete(): void {
    const target = this.orderToDelete();
    if (target) this.deleteItem(target);
    this.onModalDismiss();
  }

  onModalDismiss(): void {
    this.orderToDelete.set(null);
    this.isDeleteModalOpen.set(false);
  }

  getSharedUserFood(users: User[]) {
    this.hasUserSelected.set(users.length > 0);
    this.sharedFood.update(list => [...list, ...users]);
  }

  getPath() {
    const orderId = this.route.snapshot.params['id'];
    const orderEdit = this.findOrderById(orderId);

    if (orderEdit !== undefined) {
      this.isEdit.set(true);
      this.setOrderForEdit(orderEdit);
    }

    // if (this.orderToEditOrDelete) {
    //   this.setOrderForEdit(this.orderToEditOrDelete);
    // }
  }

  private findOrderById(orderId: string): Order | undefined {
    return this.getOrder.find((order) => order.id === orderId);
  }


  setOrderForEdit({ name, price, quantity }: Order) {
    this.orderForm.patchValue({ foodName: name, price, quantity });
  }

  editarPessoas() {
    this.sessionService.setPath('/ordens');
    this.router.navigate(['registrar']);
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
          this.usersList.update(list => [...list, ...users]);
        }
      });
  }

  createOrder() {
    this.orderService.addOrder(this.orderForm.getRawValue(), this.sharedFood());
    this.orderForm.reset();
    this.resetCheckbox.update((v) => v + 1);
  }

  editOrder() {
    const order = this.orderToEditOrDelete;
    if (order) {
      const formData = this.orderForm.getRawValue();
      this.orderService.editOrder({
        ...order,
        name: formData.foodName,
        price: formData.price,
        quantity: formData.quantity,
        sharedUsers: this.sharedFood()
      });
      this.navigateTo();
    }
  }

  deleteItem({ id }: Order) {
    this.orderService.removeOrder(id);
  }

  canEnableButtonGoToSummary(): boolean {
    return this.getOrder.length > 0;
  }

  navigateTo() {
    this.router.navigate(['resumo']);
  }

  goToSummary() {
    if (this.canEnableButtonGoToSummary()) {
      this.navigateTo();
    }
  }
}
