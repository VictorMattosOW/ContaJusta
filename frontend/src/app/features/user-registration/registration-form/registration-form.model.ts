import { FormArray } from '@angular/forms';
import { createRegistrationFormGroup, createUserInputFormGroup } from './registration-from.factory';
import { User } from 'app/features/user-registration/models/user.model';
import { REGISTRATION_FORM_CONSTANTS } from '../models/registration-form.constants';
import { signal } from '@angular/core';

export class RegistrationFormModel {
  readonly form = createRegistrationFormGroup();
  readonly formVersion = signal(0);

  get inputs(): FormArray {
    return this.form.controls.inputs;
  }

  addNewUserInput(user?: User): void {
    if (this.isValidForm()) {
      this.inputs.push(createUserInputFormGroup(user));
      this.formVersion.update((v) => v + 1);
    }
  }

  removeUserInput(index: number): void {
    this.inputs.removeAt(index);
    this.formVersion.update((v) => v - 1);
  }

  isValidForm(): boolean {
    for (const input of this.inputs.controls) {
      if (input.invalid && input.touched && !input.dirty) {
        input.markAsDirty();
      }
    }
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  canEnableSubmitButton(): boolean {
    return this.inputs.length >= REGISTRATION_FORM_CONSTANTS.MIN_USERS && this.form.valid;
  }

  buildSubmitPayload(): User[] {
    return this.inputs.getRawValue();
  }

  loadUsers(users: User[]): void {
    users.forEach((user) => this.addNewUserInput(user));
  }

  reset(): void {
    this.inputs.clear();
  }
}
