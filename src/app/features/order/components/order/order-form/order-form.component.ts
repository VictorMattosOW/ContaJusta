import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderFormControls, OrderFormData } from '../../../models/order-form.interface';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderFormComponent {
  @Output() formDataEmitter = new EventEmitter<OrderFormData>();
  readonly maxLengthCaracters = 30;
  orders = [1];

  orderForm = new FormGroup<OrderFormControls>({
    foodName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(this.maxLengthCaracters)]
    }),

    price: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01)]
    }),

    quantity: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)]
    })
  });

  createOrder() {
    const order: OrderFormData = this.orderForm.value as OrderFormData;
    this.formDataEmitter.emit(order);
    this.orderForm.reset();
  }

  updateQuantity(operation: 'add' | 'subtract'): void {
    const currentValue = this.quantity.value;
    const newValue = operation === 'add' ? currentValue + 1 : currentValue - 1;
    if (currentValue > 0) {
      this.quantity.setValue(newValue, { emitEvent: false });
    }
  }

  canEnableSubmitItemButton(): boolean {
    return this.orderForm.valid;
  }

  getFormData() {
    if (this.orderForm.valid) {
      return this.orderForm.value;
    } else {
      this.orderForm.markAllAsTouched();
      return null;
    }
  }

  isFormValid(): boolean {
    return this.foodName.dirty && this.foodName.invalid;
  }

  protected get foodName() {
    return this.orderForm.get('foodName') as FormControl;
  }

  protected get price() {
    return this.orderForm.get('price') as FormControl;
  }

  protected get quantity() {
    return this.orderForm.get('quantity') as FormControl;
  }
}
