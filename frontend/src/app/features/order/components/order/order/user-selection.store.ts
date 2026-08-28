import { computed, signal } from '@angular/core';
import { User } from 'app/core/models/user.model';

export class UserSelectionStore {
  private readonly sharedFood = signal<User[]>([]);

  readonly selectedUsers = this.sharedFood.asReadonly();
  readonly hasUserSelected = computed(() => this.sharedFood().length > 0);

  select(users: User[]): void {
    this.sharedFood.set(users);
  }

  reset(): void {
    this.sharedFood.set([]);
  }
}
