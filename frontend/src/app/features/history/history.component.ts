import { Component, inject } from '@angular/core';
import { HistoryService } from './service/history.service';

@Component({
  imports: [],
  selector: 'app-history',
  styleUrl: './history.component.css',
  templateUrl: './history.component.html'
})
export class HistoryComponent {
  private readonly historyService = inject(HistoryService);
  orders = this.historyService.orders;
}
