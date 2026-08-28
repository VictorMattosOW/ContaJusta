import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface UserInputControls {
  name: FormControl<string>;
  id: FormControl<string>;
}

// Tipo para os controles do form (derived)
export interface RegistrationFormControls {
  inputs: FormArray<FormGroup<UserInputControls>>;
}
