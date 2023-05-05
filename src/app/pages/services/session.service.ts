import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {


  private users = new BehaviorSubject<[]>([]);

  constructor() { }

  setUsers(users: any): void {
    this.users.next(users);
  }

  getUsersObservable(): Observable<any> {
    return this.users.asObservable();
  }
}