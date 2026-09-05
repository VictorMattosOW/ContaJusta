import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'app/features/user-registration/models/user.model';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { SessionService } from 'app/shared/services/session.service';
import { UserService } from 'app/shared/services/user/user.service';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { RegistrationFormModel } from './registration-form/registration-form.model';
import { ModalComponent } from 'app/shared/components/modal/modal.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  standalone: true,
  imports: [ButtonComponent, RegistrationFormComponent, ModalComponent]
})
export class RegistrationComponent implements OnInit {
  registrationFormModel = new RegistrationFormModel();
  isEdit = false;
  userToDelete = signal<string>('');
  indexUserToDelete = signal<number>(-1);
  readonly isDeleteModalOpen = signal(false);

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getPath();
    this.loadUsersFromSession();
  }

  getPath() {
    this.sessionService.getPath().subscribe({
      next: (path) => {
        this.isEdit = path === '/ordens';
      }
    });
  }

  loadUsersFromSession() {
    this.userService.users$().forEach((user: User) => this.registrationFormModel.addNewUserInput(user));
  }

  requestDelete(index: number) {
    this.indexUserToDelete.set(index);
    this.isDeleteModalOpen.set(true);
    const getInputName = this.registrationFormModel.inputs.at(index).getRawValue().name;
    this.userToDelete.set(getInputName);
  }

  addNewUserInput() {
    this.registrationFormModel.addNewUserInput();
  }

  navigateTo() {
    this.router.navigate(['/orders']);
  }

  submit() {
    if (this.registrationFormModel.canEnableSubmitButton()) {
      this.userService.addUser(this.registrationFormModel.inputs.value);
      this.navigateTo();
    }
  }

  confirmDelete() {
    if (this.indexUserToDelete() !== -1) this.registrationFormModel.removeUserInput(this.indexUserToDelete());
    this.isDeleteModalOpen.set(false);
    this.userToDelete.set('');
    this.indexUserToDelete.set(-1);
  }

  onModalDismiss() {
    this.isDeleteModalOpen.set(false);
  }
}
