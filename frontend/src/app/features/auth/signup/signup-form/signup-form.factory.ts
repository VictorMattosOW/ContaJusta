import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SignupFormControls } from '../models/signup-form.interface';
import { SIGNUP_FORM_CONSTANTS } from '../models/signup-form.constants';

export function createSignupFormGroup(): FormGroup<SignupFormControls> {
  const { MAX_LENGTH_NAME, MAX_LENGTH_EMAIL, MIN_LENGTH_PASSWORD, MAX_LENGTH_PASSWORD } = SIGNUP_FORM_CONSTANTS;

  return new FormGroup<SignupFormControls>({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(MAX_LENGTH_NAME)]
    }),

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
