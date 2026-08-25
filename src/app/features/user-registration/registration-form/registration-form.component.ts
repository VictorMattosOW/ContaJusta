import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonLinkComponent } from 'app/shared/components/button-link/button-link.component';
import { AutofocusDirective } from 'app/shared/directives/autofocus.directive';
import { RegistrationFormControls } from './registration-form.interface';

@Component({
  imports: [ReactiveFormsModule, NgClass, ButtonLinkComponent, AutofocusDirective],
  selector: 'app-registration-form',
  styleUrl: './registration-form.component.css',
  templateUrl: './registration-form.component.html',
  standalone: true
})
export class RegistrationFormComponent {
  registrationForm = input.required<FormGroup<RegistrationFormControls>>();
  addUser = output<void>();
  indexToDelete = output<number>();
  formVersion = input.required<number>();

  get inputs(): FormArray {
    return this.registrationForm().controls.inputs;
  }

  addNewUserInput() {
    this.addUser.emit();
  }
}
