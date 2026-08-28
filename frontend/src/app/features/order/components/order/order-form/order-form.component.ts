import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OrderFormControls } from '../../../models/order-form.interface';
import { ORDER_FORM_CONSTANTS } from '../../../models/order-form.constants';
import { NgClass } from '@angular/common';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgxCurrencyDirective]
})
export class OrderFormComponent {
  @Input() orderForm!: FormGroup<OrderFormControls>;
  readonly constants = ORDER_FORM_CONSTANTS;

  isFormValid(): boolean {
    return this.orderForm.controls['foodName'].dirty && this.orderForm.controls['foodName'].invalid;
  }

  updateQuantity(operation: 'add' | 'subtract'): void {
    const current = this.quantity.value ?? this.constants.MIN_QUANTITY;
    const newValue = operation === 'add' ? current + 1 : current - 1;

    if (newValue >= this.constants.MIN_QUANTITY) {
      this.quantity.setValue(newValue, { emitEvent: false });
    }
  }

  protected get foodName() {
    return this.orderForm.controls['foodName'];
  }

  protected get price() {
    return this.orderForm.controls['price'];
  }

  protected get quantity() {
    return this.orderForm.controls['quantity'];
  }
}
