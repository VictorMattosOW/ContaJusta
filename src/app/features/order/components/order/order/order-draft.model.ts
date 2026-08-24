import { signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Order } from 'app/core/models/order.model';
import { User } from 'app/core/models/user.model';
import { OrderFormControls, OrderFormData } from 'app/features/order/models/order-form.interface';
import { createOrderFormGroup } from '../order-form/order-form.factory';

export class OrderDraftModel {
  readonly form: FormGroup<OrderFormControls> = createOrderFormGroup();

  readonly isEdit = signal(false);
  private readonly orderToEdit = signal<Order | null>(null);

  startEditing(order: Order | undefined): void {
    if (order) {
      this.orderToEdit.set(order);
      this.isEdit.set(true);
      this.form.patchValue({ foodName: order.name, price: order.price, quantity: order.quantity });
    }
  }

  buildCreatePayload(): OrderFormData {
    return this.form.getRawValue();
  }

  buildEditPayload(sharedUsers: User[]): Order | null {
    const order = this.orderToEdit();
    if (!order) return null;

    const draft = this.form.getRawValue();
    return {
      ...order,
      name: draft.foodName,
      price: draft.price,
      quantity: draft.quantity,
      sharedUsers
    };
  }

  reset(): void {
    this.form.reset();
    this.isEdit.set(false);
    this.orderToEdit.set(null);
  }
}