import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';

interface Users {
  name: string;
}

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css'],
})
export class UserRegistrationComponent implements AfterViewInit {
  @ViewChild('conteudo', { static: false }) conteudoRef: ElementRef;
  form: FormGroup;

  constructor(private router: Router, private sessionService: SessionService) {
    this.buildForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.sessionService.setBackgroundColor('white');
      this.loadUsersFromSession();
    });
  }

  buildForm() {
    this.form = new FormGroup({
      inputs: new FormArray([]),
    });
  }

  loadUsersFromSession() {
    this.sessionService.getUsersObservable().subscribe({
      next: (users: Users[]) => {
        if (users) {
          users.forEach((users) => this.addNewUserInput(users.name));
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  get inputs(): FormArray {
    return this.form.get('inputs') as FormArray;
  }

  addNewUserInput(user?: string): void {
    const newUserInput = this.createNewUserInputFormGroup(user);
    if (this.isValidForm()) {
      this.inputs.push(newUserInput);
    }
  }

  createNewUserInputFormGroup(user?: string): FormGroup {
    const newInput = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(25),
      ]),
    });
    if (user) {
      newInput.get('name').setValue(user);
    }
    return newInput;
  }

  isValidForm(): boolean {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  canEnableSubmitButton(): boolean {
    return this.inputs.length >= 2 && this.form.valid;
  }

  deleteUser(index?: number) {
    this.inputs.removeAt(index);
  }

  submit() {
    if (this.canEnableSubmitButton()) {
      this.sessionService.setUsers(this.inputs.value);
      this.router.navigate(['order']);
    }
  }
}
