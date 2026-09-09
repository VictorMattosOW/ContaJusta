import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private path = new BehaviorSubject<string>('');

  setPath(path: string) {
    this.path.next(path);
  }

  getPath(): Observable<string> {
    return this.path.asObservable();
  }
}
