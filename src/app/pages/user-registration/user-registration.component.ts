import { Component } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';

interface Users {
  name: string;
}

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})

export class UserRegistrationComponent {

  form: FormGroup;

  constructor(
    private router: Router,
    private sessionService: SessionService
  ) {
    this.form = new FormGroup({
      inputs: new FormArray([])
    });

    this.sessionService.getUsersObservable().subscribe({
      next: (users: Users[]) => {
        if (users) {
          users.forEach(users => this.addInput(users.name));
        }
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  get inputs(): FormArray {
    return this.form.get('inputs') as FormArray;
  }

  addInput(user?: string) {
    const newInput = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)])
    });

    if (!user && this.form.valid) {
      this.inputs.push(newInput);
    } else if (user && this.form.valid) {
      newInput.controls['name'].setValue(user);
      this.inputs.push(newInput);
    }
  }

  isFormValid(): boolean {
    return this.inputs.length >= 2 && this.form.valid;
  }

  deleteUser(index?: number) {
    this.inputs.removeAt(index);
  }

  submit() {
    this.sessionService.setUsers(this.inputs.value);
    this.router.navigate(['order']);
  }
}
