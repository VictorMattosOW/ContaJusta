import { createSignupFormGroup } from './signup-form.factory';
import { SignupFormData } from '../models/signup-form.interface';

export class SignupFormModel {
  readonly form = createSignupFormGroup();

  isValidForm(): boolean {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  buildSubmitPayload(): SignupFormData {
    return this.form.getRawValue();
  }

  reset(): void {
    this.form.reset();
  }
}
