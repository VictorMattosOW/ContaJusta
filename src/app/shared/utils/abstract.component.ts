import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Order } from '../models/order.model';

export abstract class AbstractComponent {
  constructor() {}

  getSharedUserNames(order: Order): string {
    return order.sharedUsers.map((user) => user.name).join(', ');
  }

  multiplyValues(quantity: number, price: number): number {
    return quantity * price;
  }

  isValidForm(form: FormGroup, arrayName?: string): boolean {
    const inputs = form.get(`${arrayName}`) as FormArray;
    if (inputs) {
      for (const input of inputs.controls) {
        if (input.invalid && input.touched && !input.dirty) {
          input.markAsDirty();
        }
      }
    }

    form.markAllAsTouched();
    return form.valid;
  }
}
