import { Component, Input } from '@angular/core';
import { User } from 'app/core/models/user.model';
import { APP_CONSTANTS } from 'app/shared/constants/app.constants';

@Component({
    selector: 'app-order-user-display',
    styleUrls: ['./order-user-display.component.css'],
    template: `
    <span class="legend-light">
      {{ sharedUsers | userNames | userNamesDisplay }}
      <span
        *ngIf="sharedUsers.length > maxUsers"
        class="tooltip-trigger"
        (mouseenter)="isTooltipVisible = true"
        (mouseleave)="isTooltipVisible = false">
        ,&nbsp;
        <app-tooltip
          [showTooltip]="isTooltipVisible"
          [content]="sharedUsers | userNamesDisplay"
          [numberOfUsers]="sharedUsers.length - maxUsers">
        </app-tooltip>
      </span>
    </span>
  `,
    standalone: false
})
export class OrderUserDisplayComponent {
  @Input() sharedUsers: User[] = [];
  maxUsers = APP_CONSTANTS.MAX_USERS_IN_DISPLAY;
  isTooltipVisible = false;
}
