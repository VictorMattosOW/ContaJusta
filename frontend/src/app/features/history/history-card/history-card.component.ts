import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from 'app/shared/pipes/currency.pipe';
import { User } from 'app/features/user-registration/models/user.model';
import { UserNamesDisplayPipe } from 'app/shared/pipes/user-names-display.pipe';
import { RouterLink } from '@angular/router';
import { HistoryOrder } from 'app/features/order/services/order.service';

@Component({
  imports: [DatePipe, CurrencyPipe, UserNamesDisplayPipe, RouterLink],
  selector: 'app-history-card',
  styleUrl: './history-card.component.css',
  templateUrl: './history-card.component.html'
})
export class HistoryCardComponent {
  history = input.required<HistoryOrder>();

  get getUsers() {
    const users: User[] = this.history().ordersPerUser.map((user) => {
      const { name, userId } = user;
      return {
        name,
        id: userId
      };
    });

    return users;
  }
}
