import { ChangeDetectionStrategy, Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderFormComponent } from '../order-form/order-form.component';
import { Subject, takeUntil } from 'rxjs';
import { Order } from 'app/core/models/order.model';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { ButtonLinkComponent } from 'app/shared/components/button-link/button-link.component';
import { CardOrdersComponent } from '../card-orders/card-orders.component';
import { UserCheckboxComponent } from '../user-checkbox/user-checkbox.component';
import { ModalComponent } from 'app/shared/components/modal/modal.component';
import { OrderService } from 'app/features/order/services/order.service';
import { UserService } from 'app/shared/services/user/user.service';
import { OrderDraftModel } from './order-draft.model';
import { UserSelectionStore } from './user-selection.store';

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
  readonly draft = new OrderDraftModel();
  readonly selection = new UserSelectionStore();
  readonly usersList = computed(() => this.userService.users$());

  readonly isDeleteModalOpen = signal(false);
  readonly orderToDelete = signal<Order | null>(null);
  readonly isSubmitButton = signal(false);
  readonly resetCheckbox = signal(0);

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly orderService: OrderService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.startEditFlow();
    this.draft.form.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.isSubmitButton.set(this.draft.form.valid));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get getOrder(): Order[] {
    return this.orderService.orders$();
  }

  private startEditFlow(): void {
    const orderId = this.route.snapshot.params['id'];
    this.draft.startEditing(this.findOrderById(orderId));
  }

  private findOrderById(orderId: string): Order | undefined {
    return this.getOrder.find((order) => order.id === orderId);
  }

  requestDelete(order: Order): void {
    this.orderToDelete.set(order);
    this.isDeleteModalOpen.set(true);
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

  createOrder() {
    this.orderService.addOrder(this.draft.buildCreatePayload(), this.selection.selectedUsers());
    this.draft.reset();
    this.selection.reset();
    this.resetCheckbox.update((v) => v + 1);
  }

  editOrder() {
    const payload = this.draft.buildEditPayload(this.selection.selectedUsers());
    if (payload) {
      this.orderService.editOrder(payload);
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
