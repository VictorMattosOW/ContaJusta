import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';
import { SessionService } from 'src/app/shared/services/session.service';
import { AbstractComponent } from 'src/app/shared/utils/abstract.component';
import * as uuid from 'uuid';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent
  extends AbstractComponent
  implements OnInit, AfterViewChecked, AfterViewInit
{
  @ViewChild('conteudo', { static: false }) conteudoRef: ElementRef;

  form: FormGroup = new FormGroup({
    inputs: new FormArray([]),
  });

  isEdit = false;
  errorMsg = '';
  hasError = false;
  constructor(
    private router: Router,
    private sessionService: SessionService,
    private cd: ChangeDetectorRef
  ) {
    super();
  }

  ngAfterViewInit(): void {
    setInterval(() => {
      this.sessionService.setBackgroundColor('white');
    });
    this.cd.detectChanges();
  }

  ngOnInit(): void {
    this.getPath();
    this.loadUsersFromSession();
  }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  getPath() {
    this.sessionService.getPath().subscribe({
      next: (path) => {
        this.isEdit = path === '/ordens';
      },
    });
  }

  loadUsersFromSession() {
    this.sessionService.getUsersObservable().subscribe({
      next: (users: User[]) => {
        if (users) {
          users.forEach((users) => this.addNewUserInput(users));
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

  addNewUserInput(user?: User): void {
    const newUserInput = this.createNewUserInputFormGroup(user);

    if (this.isValidForm(this.form).valid) {
      this.inputs.push(newUserInput);
    }
  }

  // isValidForm(): boolean {
  //   const inputs = this.form.get('inputs') as FormArray;
  //   for (const input of inputs.controls) {
  //     if (input.invalid && input.touched && !input.dirty) {
  //       input.markAsDirty();
  //     }
  //   }

  //   this.form.markAllAsTouched();
  //   return this.form.valid;
  // }

  createNewUserInputFormGroup(user?: User): FormGroup {
    const newInput = new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(25)],
      }),
      id: new FormControl(uuid.v4()),
    });

    if (user) {
      newInput.get('name').setValue(user.name);
      newInput.get('id').setValue(user.id);
    }
    return newInput;
  }

  canEnableSubmitButton(): boolean {
    return this.inputs.length >= 2 && this.form.valid;
  }

  deleteUser(index?: number) {
    this.inputs.removeAt(index);
    this.cd.detectChanges();
  }

  submit() {
    if (this.canEnableSubmitButton()) {
      this.sessionService.setUsers(this.inputs.value);
      this.router.navigate(['ordens']);
    }
  }
}
