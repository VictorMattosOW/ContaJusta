import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';
import { SessionService } from 'src/app/shared/services/session.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit, AfterViewChecked {
  @ViewChild('conteudo', { static: false }) conteudoRef: ElementRef;
  form: FormGroup;
  isEdit = false;
  errorMsg: string;
  constructor(
    private router: Router,
    private sessionService: SessionService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.sessionService.setBackgroundColor('white');
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
    })
  }

  buildForm() {
    this.form = new FormGroup({
      inputs: new FormArray([]),
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

    if (this.isValidForm()) {
      this.inputs.push(newUserInput);
    }
  }

  createNewUserInputFormGroup(user?: User): FormGroup {
    const newInput = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(25),
      ]),
      id: new FormControl(uuid.v4()),
    }, {updateOn: 'blur'});
    if (user) {
      newInput.get('name').setValue(user.name);
      newInput.get('id').setValue(user.id);
    }
    return newInput;
  }

  getValidity(index: number) {
    if ((<FormArray>this.form.get('inputs')).controls[index].value['name'].length === 0) {
      this.errorMsg = 'Ops! Esse nome está em branco.'
    } else {
      this.errorMsg = 'O nome precisa ter mais de uma letra.'
    }
    return (<FormArray>this.form.get('inputs')).controls[index].touched && (<FormArray>this.form.get('inputs')).controls[index].invalid;
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
    this.cd.detectChanges();
  }

  submit() {
    if (this.canEnableSubmitButton()) {
      this.sessionService.setUsers(this.inputs.value);
      this.router.navigate(['ordens']);
    }
  }
}
