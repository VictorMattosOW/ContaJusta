import { NgClass } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'app/core/models/user.model';
import { ButtonLinkComponent } from 'app/shared/components/button-link/button-link.component';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { AutofocusDirective } from 'app/shared/directives/autofocus.directive';
import { SessionService } from 'app/shared/services/session.service';
import { UserService } from 'app/shared/services/user/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule, NgClass, ButtonLinkComponent, AutofocusDirective]
})
export class RegistrationComponent implements OnInit, AfterViewChecked, AfterViewInit {
  @ViewChild('autofocus', { static: false }) autofocusRef?: ElementRef;
  @ViewChild('dialog') dialogElement!: ElementRef<HTMLDialogElement>;

  form: FormGroup = new FormGroup({
    inputs: new FormArray([])
  });

  isEdit = false;
  errorMsg = '';
  hasError = false;
  userToDelete: User = {} as User;
  indexUserToDelete = -1;

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private userService: UserService,
    private cd: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  ngOnInit(): void {
    this.getPath();
    this.loadUsersFromSession();
  }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  openDialog(index: number): void {
    this.indexUserToDelete = index;
    const deletedUser = this.inputs.at(index).value;
    if (deletedUser) {
      this.userToDelete = deletedUser;
    }
    this.dialogElement.nativeElement.show();
  }

  closeDialog(): void {
    this.dialogElement.nativeElement.close();
  }

  getPath() {
    this.sessionService.getPath().subscribe({
      next: (path) => {
        this.isEdit = path === '/ordens';
      }
    });
  }

  loadUsersFromSession() {
    this.userService.users$().forEach((user: User) => this.addNewUserInput(user));
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

  isValidForm(): boolean {
    const inputs = this.form.get('inputs') as FormArray;
    for (const input of inputs.controls) {
      if (input.invalid && input.touched && !input.dirty) {
        input.markAsDirty();
      }
    }

    this.form.markAllAsTouched();
    return this.form.valid;
  }

  createNewUserInputFormGroup(user?: User): FormGroup {
    return new FormGroup({
      // Se o user.name existir, usa ele. Se não, começa com string vazia.
      name: new FormControl(user?.name ?? '', {
        validators: [Validators.required, Validators.maxLength(25)]
      }),
      // Se o user.id existir, usa ele. Se não, gera um novo UUID.
      id: new FormControl(user?.id ?? crypto.randomUUID())
    });
  }

  canEnableSubmitButton(): boolean {
    return this.inputs.length >= 2 && this.form.valid;
  }

  deleteUser(index: number) {
    this.inputs.removeAt(index);
    this.cd.detectChanges();
    this.closeDialog();
  }

  navigateTo() {
    console.log('/orders');

    this.router.navigate(['/orders']);
  }

  submit() {
    if (this.canEnableSubmitButton()) {
      this.userService.addUser(this.inputs.value);
      this.navigateTo();
    }
  }
}
