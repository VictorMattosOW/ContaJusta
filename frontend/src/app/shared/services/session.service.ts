import { Injectable } from '@angular/core';
import { FinalOrder } from 'app/core/models/order.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private finalOrder = new BehaviorSubject<FinalOrder>({} as FinalOrder);
  private path = new BehaviorSubject<string>('');

  setFinalOrder(finalOrder: FinalOrder): void {
    this.finalOrder.next(finalOrder);
  }

  getFinalOrderObservable(): Observable<FinalOrder> {
    return this.finalOrder.asObservable();
  }

  setPath(path: string) {
    this.path.next(path);
  }

  getPath(): Observable<string> {
    return this.path.asObservable();
  }
}
