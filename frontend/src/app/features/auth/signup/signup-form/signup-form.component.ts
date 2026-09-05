import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { SignupFormControls } from '../models/signup-form.interface';
import { SIGNUP_FORM_CONSTANTS } from '../models/signup-form.constants';

@Component({
  imports: [ReactiveFormsModule, NgClass],
  selector: 'app-signup-form',
  styleUrl: './signup-form.component.css',
  templateUrl: './signup-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class SignupFormComponent {
  signupForm = input.required<FormGroup<SignupFormControls>>();
  readonly constants = SIGNUP_FORM_CONSTANTS;

  protected get name() {
    return this.signupForm().controls['name'];
  }

  protected get email() {
    return this.signupForm().controls['email'];
  }

  protected get password() {
    return this.signupForm().controls['password'];
  }
}
