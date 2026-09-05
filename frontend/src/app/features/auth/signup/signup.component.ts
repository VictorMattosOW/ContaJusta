import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { ButtonLinkComponent } from 'app/shared/components/button-link/button-link.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { SignupFormModel } from './signup-form/signup-form.model';
import { AuthService } from '../services/auth.service';
import { SingInRequest } from '../services/auth.model';

@Component({
  imports: [ButtonComponent, ButtonLinkComponent, SignupFormComponent],
  selector: 'app-signup',
  styleUrl: './signup.component.css',
  templateUrl: './signup.component.html',
  standalone: true
})
export class SignupComponent {
  signupFormModel = new SignupFormModel();
  private readonly authService = inject(AuthService);

  private readonly formStatus = toSignal(this.signupFormModel.form.statusChanges, {
    initialValue: this.signupFormModel.form.status
  });

  readonly isFormValid = computed(() => this.formStatus() === 'VALID');

  private readonly isSubmitting = signal(false);

  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['login']);
  }

  submit() {
    if (this.signupFormModel.isValidForm()) {
      this.isSubmitting.set(true);
      const singInForm: SingInRequest = {
        name: this.signupFormModel.form.getRawValue().name,
        email: this.signupFormModel.form.getRawValue().email,
        password: this.signupFormModel.form.getRawValue().password
      };
      this.authService.singIn(singInForm).subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['registrar']);
        },
        error(err) {
          console.error(err);
        }
      });
    }
  }
}
