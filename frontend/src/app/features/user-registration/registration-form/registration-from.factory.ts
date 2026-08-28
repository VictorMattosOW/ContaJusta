import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistrationFormControls, UserInputControls } from './registration-form.interface';
import { REGISTRATION_FORM_CONSTANTS } from '../models/registration-form.constants';

export function createRegistrationFormGroup(): FormGroup<RegistrationFormControls> {
  return new FormGroup<RegistrationFormControls>({
    inputs: new FormArray<FormGroup<UserInputControls>>([])
  });
}

export function createUserInputFormGroup(user?: { name?: string; id?: string }): FormGroup<UserInputControls> {
  const { MAX_LENGTH_NAME } = REGISTRATION_FORM_CONSTANTS;

  return new FormGroup<UserInputControls>({
    name: new FormControl(user?.name ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(MAX_LENGTH_NAME)]
    }),
    id: new FormControl(user?.id ?? crypto.randomUUID(), {
      nonNullable: true
    })
  });
}
