import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { OrderFormData } from '../../../models/order-form.interface';
import { Subject, takeUntil } from 'rxjs';
import { createOrderFormGroup } from './order-form.factory';
import { ORDER_FORM_CONSTANTS } from '../../../models/order-form.constants';

@Component({
    selector: 'app-order-form',
    templateUrl: './order-form.component.html',
    styleUrls: ['./order-form.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class OrderFormComponent implements OnInit, OnDestroy {
  @Output() formData = new EventEmitter<OrderFormData>();
  @Output() formValidityChange = new EventEmitter<boolean>();
  readonly constants = ORDER_FORM_CONSTANTS;
  private readonly destroy$ = new Subject<void>();

  orderForm: FormGroup = createOrderFormGroup();

  ngOnInit(): void {
    this.orderForm.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.formValidityChange.emit(this.orderForm.valid);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitOrder() {
    const order: OrderFormData = this.orderForm.value as OrderFormData;
    this.formData.emit(order);
    this.orderForm.reset();
  }

  updateQuantity(operation: 'add' | 'subtract'): void {
    const current = this.quantity.value ?? this.constants.MIN_QUANTITY;
    const newValue = operation === 'add' ? current + 1 : current - 1;

    if (newValue >= this.constants.MIN_QUANTITY) {
      this.quantity.setValue(newValue, { emitEvent: false });
    }
  }

  isFormValid(): boolean {
    return this.foodName.dirty && this.foodName.invalid;
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
