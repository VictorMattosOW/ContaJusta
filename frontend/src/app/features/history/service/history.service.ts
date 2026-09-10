import { httpResource } from '@angular/common/http';
import { Service } from '@angular/core';
import { getAllOrders } from 'app/features/order/services/order.service';

@Service()
export class HistoryService {
  private readonly apiUrl = 'http://localhost:8080/division';

  readonly orders = httpResource<getAllOrders[]>(() => `${this.apiUrl}/history`);
}
