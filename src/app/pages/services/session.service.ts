import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private users = new BehaviorSubject<[]>([]);
  private changeBgColor = new BehaviorSubject<string>('white');
  constructor() { }

  setUsers(users: any): void {
    this.users.next(users);
  }

  getUsersObservable(): Observable<any> {
    return this.users.asObservable();
  }

  setBackgroundColor(color: string) {
    this.changeBgColor.next(color);
  }

  getBackgroundColor(): Observable<string> {
    return this.changeBgColor.asObservable();
  }
}