import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginFormControls } from '../models/login-form.interface';
import { LOGIN_FORM_CONSTANTS } from '../models/login-form.constants';

export function createLoginFormGroup(): FormGroup<LoginFormControls> {
  const { MAX_LENGTH_EMAIL, MIN_LENGTH_PASSWORD, MAX_LENGTH_PASSWORD } = LOGIN_FORM_CONSTANTS;

  return new FormGroup<LoginFormControls>({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(MAX_LENGTH_EMAIL)]
    }),

    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(MIN_LENGTH_PASSWORD),
        Validators.maxLength(MAX_LENGTH_PASSWORD)
      ]
    })
  });
}
