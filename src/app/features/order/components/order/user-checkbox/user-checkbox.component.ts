import { Component, Input } from '@angular/core';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-user-checkbox',
  templateUrl: './user-checkbox.component.html',
  styleUrls: ['./user-checkbox.component.css']
})
export class UserCheckboxComponent {
  @Input() usersList: User[] = [];
  @Input() selectedUsers: boolean[] = [];

  markAllUsers = false;
  sharedFood: User[] = [];

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
  }

  selectedUser(index: number, event: Event | boolean) {
    const checked = event instanceof Event ? (event.target as HTMLInputElement).checked : event;

    if (checked) {
      this.sharedFood.push(this.usersList[index]);
    } else {
      this.sharedFood = this.sharedFood.filter((element) => element !== this.usersList[index]);
    }
    this.selectedUsers[index] = checked;
  }
}
