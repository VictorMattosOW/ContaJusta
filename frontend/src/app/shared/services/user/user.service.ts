import { Service, signal } from '@angular/core';
import { User } from 'app/features/user-registration/models/user.model';

@Service()
export class UserService {
  private users = signal<User[]>([]);
  readonly users$ = this.users.asReadonly();

  addUser(data: User[]): User[] {
    const users: User[] = data.map((u) => {
      return {
        ...u,
        id: u.id ?? crypto.randomUUID()
      };
    });
    this.users.update(() => [...users]);
    return data;
  }

  removeUser(id: string): void {
    this.users.update((list) => list.filter((u) => u.id !== id));
  }

  updateUser(data: User): void {
    this.users.update((list) => list.map((u) => (u.id === data.id ? { ...u, ...data } : u)));
  }

  resetUser(): void {
    this.users.set([]);
  }
}
