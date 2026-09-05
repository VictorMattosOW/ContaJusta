import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderFormComponent } from '../order-form/order-form.component';
import { Order } from 'app/features/order/models/order.model';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { ButtonLinkComponent } from 'app/shared/components/button-link/button-link.component';
import { CardOrdersComponent } from '../card-orders/card-orders.component';
import { UserCheckboxComponent } from '../user-checkbox/user-checkbox.component';
import { ModalComponent } from 'app/shared/components/modal/modal.component';
import { OrderService } from 'app/features/order/services/order.service';
import { UserService } from 'app/shared/services/user/user.service';
import { OrderDraftModel } from './order-draft.model';
import { UserSelectionStore } from './user-selection.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from 'app/features/user-registration/models/user.model';

function sameUserIds(a: User[], b: User[]): boolean {
  if (a.length !== b.length) return false;
  const ids = new Set(a.map((u) => u.id));
  return b.every((u) => ids.has(u.id));
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent,
    ButtonLinkComponent,
    OrderFormComponent,
    CardOrdersComponent,
    UserCheckboxComponent,
    ModalComponent
  ]
})
export class OrderComponent implements OnInit {
  private readonly router = inject(Router); // troca constructor por inject()
  private readonly route = inject(ActivatedRoute); // motives: field-init order
  private readonly orderService = inject(OrderService);
  private readonly userService = inject(UserService);

  readonly draft = new OrderDraftModel();
  readonly selection = new UserSelectionStore();

  readonly orders = this.orderService.orders$; // substitui get getOrder()
  readonly usersList = this.userService.users$; // substitui o computed-inútil

  readonly formStatus = toSignal(this.draft.form.statusChanges, {
    initialValue: this.draft.form.status
  });
  readonly formValues = toSignal(this.draft.form.valueChanges, {
    initialValue: this.draft.form.value
  });

  readonly isFormValid = computed(() => this.formStatus() === 'VALID');

  readonly hasChanges = computed(() => {
    const original = this.draft.original();
    if (!original) return false;
    const v = this.formValues();
    return (
      v.foodName !== original.name ||
      v.price !== original.price ||
      v.quantity !== original.quantity ||
      !sameUserIds(this.selection.selectedUsers(), original.sharedUsers)
    );
  });

  readonly canCreate = computed(() => this.isFormValid() && this.selection.hasUserSelected());
  readonly canSave = computed(() => this.canCreate() && this.hasChanges());
  readonly isDeleteModalOpen = signal(false);
  readonly orderToDelete = signal<Order | null>(null);

  ngOnInit(): void {
    this.startEditFlow();
    this.hasUsers();
  }

  hasUsers() {
    if (this.usersList().length === 0) {
      this.router.navigate(['registrar']);
    }
  }

  private startEditFlow(): void {
    const orderId = this.route.snapshot.params['id'];
    const order = this.findOrderById(orderId);
    this.draft.startEditing(order);
    if (order) {
      this.selection.select(order.sharedUsers);
    }
  }

  private findOrderById(orderId: string): Order | undefined {
    return this.orders().find((order) => order.id === orderId);
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
  }

  editOrder() {
    const payload = this.draft.buildEditPayload(this.selection.selectedUsers());
    if (payload) {
      this.orderService.editOrder(payload);
      this.navigateToSummary();
    }
  }

  deleteItem({ id }: Order) {
    this.orderService.removeOrder(id);
  }

  navigateToSummary() {
    if (this.orders().length > 0) {
      this.router.navigate(['resumo']);
    }
  }
}
