import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { LoginFormControls } from '../models/login-form.interface';
import { LOGIN_FORM_CONSTANTS } from '../models/login-form.constants';

@Component({
  imports: [ReactiveFormsModule, NgClass],
  selector: 'app-login-form',
  styleUrl: './login-form.component.css',
  templateUrl: './login-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class LoginFormComponent {
  loginForm = input.required<FormGroup<LoginFormControls>>();
  readonly constants = LOGIN_FORM_CONSTANTS;

  protected get email() {
    return this.loginForm().controls['email'];
  }

  protected get password() {
    return this.loginForm().controls['password'];
  }
}
