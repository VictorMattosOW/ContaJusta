import { Injectable } from '@angular/core';
import { User } from 'src/app/core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private maxNumberOfUsersInDisplay = 2;

  constructor() {}

  get maxNumberOfUsersInDisplayValue(): number {
    return this.maxNumberOfUsersInDisplay;
  }

  getConcatenatedUserNames(sharedUsers: User[]): string {
    return sharedUsers.map((user) => user.name).join(', ');
  }

  getMaxNumberOfUsersInDisplay(users: User[]): User[] {
    return users.slice(0, this.maxNumberOfUsersInDisplay);
  }
}
