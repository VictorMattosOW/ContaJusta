import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { ButtonLinkComponent } from 'app/shared/components/button-link/button-link.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { LoginFormModel } from './login-form/login-form.model';
@Component({
  imports: [ButtonComponent, ButtonLinkComponent, LoginFormComponent],
  selector: 'app-login',
  styleUrl: './login.component.css',
  templateUrl: './login.component.html',
  standalone: true
})
export class LoginComponent {
  loginFormModel = new LoginFormModel();
  private readonly router = inject(Router);
  private readonly formStatus = toSignal(this.loginFormModel.form.statusChanges, {
    initialValue: this.loginFormModel.form.status
  });

  readonly isFormValid = computed(() => this.formStatus() === 'VALID');

  private readonly isSubmitting = signal(false);

  goToSignup() {
    this.router.navigate(['criar-conta']);
  }

  submit() {
    if (this.loginFormModel.isValidForm()) {
      this.isSubmitting.set(true);
      // TODO: integrar com o backend de autenticação
      this.router.navigate(['orders']);
    }
  }
}
