import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'app/core/models/user.model';

@Component({
  selector: 'app-user-checkbox',
  templateUrl: './user-checkbox.component.html',
  styleUrls: ['./user-checkbox.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCheckboxComponent {
  @Input() usersList: User[] = [];
  @Output() selectedUserList = new EventEmitter<User[]>();
  @Input() set resetTrigger(value: boolean) {
    if (value) {
      this.markAllUsers = false;
      this.sharedFood = [];
      this.selectedUsers = [];
      this.selectedUserList.emit([]);
    }
  }

  markAllUsers = false;
  sharedFood: User[] = [];
  selectedUsers: boolean[] = [];

  // user-checkbox.component.ts
  trackByUserId(index: number, user: User): string {
    return user.id;
  }

  selectAllUser(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.sharedFood = [...this.usersList];
      this.selectedUsers.length = this.sharedFood.length;
      this.selectedUsers.fill(checked);
    } else {
      this.sharedFood = [];
      this.selectedUsers.fill(checked);
    }
    this.markAllUsers = checked;
    this.selectedUserList.emit(this.sharedFood);
  }

  selectedUser(index: number, event: Event | boolean) {
    const checked = event instanceof Event ? (event.target as HTMLInputElement).checked : event;

    if (checked) {
      this.sharedFood.push(this.usersList[index]);
    } else {
      this.sharedFood = this.sharedFood.filter((element) => element !== this.usersList[index]);
    }
    this.selectedUsers[index] = checked;
    this.selectedUserList.emit(this.sharedFood);
  }
}
