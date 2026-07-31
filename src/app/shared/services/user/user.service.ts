import { Service, signal } from '@angular/core';
import { User } from 'app/core/models/user.model';

@Service()
export class UserService {
  private users = signal<User[]>([]);
  readonly users$ = this.users.asReadonly();

  addUser(data: User): User {
    this.users.update(list => [...list, data]);
    return data;
  }

  removeUser(id: string): void {
    this.users.update(list => list.filter(u => u.id !== id));
  }

  updateUser(data: User): void {
    this.users.update(list => list.map(u => u.id === data.id ? { ...u, ...data } : u));
  }

  resetUser():void {
    this.users.set([]);
  }
}
