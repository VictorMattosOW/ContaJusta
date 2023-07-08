import { FormArray, FormGroup } from '@angular/forms';
import { Order } from '../models/order.model';

export abstract class AbstractComponent {
  constructor() {}

  getSharedUserNames(order: Order): string {
    return order.sharedUsers.map((user) => user.name).join(', ');
  }

  multiplyValues(quantity: number, price: number): number {
    return quantity * price;
  }

  isValidForm(form: FormGroup): FormGroup {
    const formArray = form.controls ? Object.values(form.controls)[0] as FormArray : null;

    if (formArray instanceof FormArray && formArray.controls) {
      formArray.controls.forEach(input => {
        if (input.invalid && input.touched && !input.dirty) {
          // TODO: entender melhor essa func e ver se vale a pena manter ela aqui
          console.log('chegou aqui');

          input.markAsDirty();
        }
      });
    }

    form.markAllAsTouched();
    return form;
  }
}
