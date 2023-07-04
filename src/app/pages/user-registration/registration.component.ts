import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';
import { SessionService } from 'src/app/shared/services/session.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements AfterViewInit, OnInit {
  @ViewChild('conteudo', { static: false }) conteudoRef: ElementRef;
  form: FormGroup;
  isEdit = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private cd: ChangeDetectorRef
  ) {
  }
  ngOnInit(): void {
    this.buildForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.sessionService.setBackgroundColor('white');
      this.getPath();
      this.loadUsersFromSession();
    });
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
    });
    if (user) {
      newInput.get('name').setValue(user.name);
      newInput.get('id').setValue(user.id);
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
    this.cd.detectChanges();
  }

  submit() {
    if (this.canEnableSubmitButton()) {
      this.sessionService.setUsers(this.inputs.value);
      this.router.navigate(['ordens']);
    }
  }
}
