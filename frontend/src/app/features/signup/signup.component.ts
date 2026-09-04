import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { ButtonLinkComponent } from 'app/shared/components/button-link/button-link.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { SignupFormModel } from './signup-form/signup-form.model';

@Component({
  imports: [ButtonComponent, ButtonLinkComponent, SignupFormComponent],
  selector: 'app-signup',
  styleUrl: './signup.component.css',
  templateUrl: './signup.component.html',
  standalone: true
})
export class SignupComponent {
  signupFormModel = new SignupFormModel();

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
      // TODO: integrar com o backend de cadastro
      this.router.navigate(['login']);
    }
  }
}
