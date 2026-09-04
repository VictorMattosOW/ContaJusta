import { FormControl } from '@angular/forms';

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

// Tipo para os controles do form (derived)
export type SignupFormControls = {
  [K in keyof SignupFormData]: FormControl<SignupFormData[K]>;
};
