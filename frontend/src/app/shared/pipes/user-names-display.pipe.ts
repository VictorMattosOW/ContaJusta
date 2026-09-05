import { Pipe, PipeTransform } from '@angular/core';
import { User } from 'app/features/user-registration/models/user.model';

@Pipe({
  name: 'userNamesDisplay',
  standalone: true
})
export class UserNamesDisplayPipe implements PipeTransform {
  transform(sharedUsers: User[]): string {
    return sharedUsers.map((user) => user.name).join(', ');
  }
}
