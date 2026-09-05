import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { ButtonLinkComponent } from 'app/shared/components/button-link/button-link.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { LoginFormModel } from './login-form/login-form.model';
import { AuthService } from '../services/auth.service';
import { LoginRequest } from '../services/auth.model';
@Component({
  imports: [ButtonComponent, ButtonLinkComponent, LoginFormComponent],
  selector: 'app-login',
  styleUrl: './login.component.css',
  templateUrl: './login.component.html',
  standalone: true
})
export class LoginComponent {
  loginFormModel = new LoginFormModel();
  private readonly authService = inject(AuthService);

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
      const login: LoginRequest = {
        email: this.loginFormModel.form.getRawValue().email,
        password: this.loginFormModel.form.getRawValue().password
      };
      this.authService.login(login).subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['registrar']);
        },
        error(err) {
          console.error(err);
        }
      });
      // this.router.navigate(['orders']);
    }
  }
}
