import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order } from 'src/app/shared/models/order.model';
import { User } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private users = new BehaviorSubject<User[]>([]);
  private orders = new BehaviorSubject<Order[]>([]);
  private changeBgColor = new BehaviorSubject<string>('white');
  private path = new BehaviorSubject<string>('');
  constructor() { }

  setUsers(users: User[]): void {
    this.users.next(users);
  }

  getUsersObservable(): Observable<User[]> {
    return this.users.asObservable();
  }

  setOrders(orders: Order[]): void {
    this.orders.next(orders);
  }

  getOrdersObservable(): Observable<Order[]> {
    return this.orders.asObservable();
  }

  setBackgroundColor(color: string) {
    this.changeBgColor.next(color);
  }

  getBackgroundColor(): Observable<string> {
    return this.changeBgColor.asObservable();
  }

  setPath(path: string) {
    this.path.next(path);
  }

  getPath(): Observable<string> {
    return this.path.asObservable();
  }
}
