import { FormControl } from '@angular/forms';

export interface LoginFormData {
  email: string;
  password: string;
}

// Tipo para os controles do form (derived)
export type LoginFormControls = {
  [K in keyof LoginFormData]: FormControl<LoginFormData[K]>;
};
