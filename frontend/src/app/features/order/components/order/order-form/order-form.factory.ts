import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderFormControls } from '../../../models/order-form.interface';
import { ORDER_FORM_CONSTANTS } from '../../../models/order-form.constants';

export function createOrderFormGroup(): FormGroup<OrderFormControls> {
  const { MAX_LENGTH_FOOD_NAME, MIN_PRICE, MIN_QUANTITY } = ORDER_FORM_CONSTANTS;

  return new FormGroup<OrderFormControls>({
    foodName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(MAX_LENGTH_FOOD_NAME)]
    }),

    price: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(MIN_PRICE)]
    }),

    quantity: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(MIN_QUANTITY)]
    })
  });
}
