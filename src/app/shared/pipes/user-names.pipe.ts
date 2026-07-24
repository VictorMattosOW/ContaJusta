import { Pipe, PipeTransform } from '@angular/core';
import { APP_CONSTANTS } from '../../shared/constants/app.constants';
import { User } from 'app/core/models/user.model';

@Pipe({
    name: 'userNames',
    standalone: false
})
export class UserNamesPipe implements PipeTransform {
  transform(users: User[]): User[] {
    return users.slice(0, APP_CONSTANTS.MAX_USERS_IN_DISPLAY);
  }
}
