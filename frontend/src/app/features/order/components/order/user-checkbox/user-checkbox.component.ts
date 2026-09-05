import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from 'app/features/user-registration/models/user.model';

@Component({
  selector: 'app-user-checkbox',
  templateUrl: './user-checkbox.component.html',
  styleUrls: ['./user-checkbox.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule]
})
export class UserCheckboxComponent {
  readonly usersList = input.required<User[]>();
  readonly selectedUsers = input<User[]>([]);
  readonly selectedUsersChange = output<User[]>();

  readonly selectedIds = computed(() => new Set(this.selectedUsers().map((u) => u.id)));
  readonly allSelected = computed(
    () => this.usersList().length > 0 && this.selectedUsers().length === this.usersList().length
  );

  toggleUser(user: User, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const next = checked ? [...this.selectedUsers(), user] : this.selectedUsers().filter((u) => u.id !== user.id);
    this.selectedUsersChange.emit(next);
  }

  selectAllUser(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedUsersChange.emit(checked ? [...this.usersList()] : []);
  }
}
