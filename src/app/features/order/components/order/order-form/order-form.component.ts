import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from 'node_modules/@angular/forms';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderFormComponent {

  maxLengthCaracteres = 30;
  quantity = 1;
  orderForm: FormGroup = new FormGroup({
    foodName: new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
    ]),
    price: new FormControl(null, [Validators.required, Validators.min(0.01)]),
  });

    updateQuantity(event: Event, operation: 'add' | 'subtract') {
    event.preventDefault();

    if (operation === 'add') {
      this.quantity++;
    } else if (operation === 'subtract' && this.quantity > 1) {
      this.quantity--;
    }
  }

  get foodName() {
    return this.orderForm.get('foodName')!;
  }

  get price() {
    return this.orderForm.get('price')!;
  }
}
