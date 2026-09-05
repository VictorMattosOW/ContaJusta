import { createLoginFormGroup } from './login-form.factory';
import { LoginFormData } from '../models/login-form.interface';

export class LoginFormModel {
  readonly form = createLoginFormGroup();

  isValidForm(): boolean {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  buildSubmitPayload(): LoginFormData {
    return this.form.getRawValue();
  }

  reset(): void {
    this.form.reset();
  }
}
