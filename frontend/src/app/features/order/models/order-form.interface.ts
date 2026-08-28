import { FormControl } from '@angular/forms';

export interface OrderFormData {
  foodName: string;
  price: number;
  quantity: number;
}

// Tipo para os controles do form (derived)
export type OrderFormControls = {
  [K in keyof OrderFormData]: FormControl<OrderFormData[K]>;
};
