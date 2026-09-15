import { Component, inject } from '@angular/core';
import { HistoryCardComponent } from './history-card/history-card.component';
import { OrderService } from '../order/services/order.service';

@Component({
  imports: [HistoryCardComponent],
  selector: 'app-history',
  styleUrl: './history.component.css',
  templateUrl: './history.component.html'
})
export class HistoryComponent {
  private readonly historyService = inject(OrderService);
  historyOrder = this.historyService.histories;
}
