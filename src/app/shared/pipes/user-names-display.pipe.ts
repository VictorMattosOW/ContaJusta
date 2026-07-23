import { Pipe, PipeTransform } from '@angular/core';
import { User } from 'app/core/models/user.model';

@Pipe({
  name: 'userNamesDisplay'
})
export class UserNamesDisplayPipe implements PipeTransform {
  transform(sharedUsers: User[]): string {
    return sharedUsers.map((user) => user.name).join(', ');
  }
}
