import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { User } from 'app/core/models/user.model';
import { TooltipComponent } from 'app/shared/components/tooltip/tooltip.component';
import { APP_CONSTANTS } from 'app/shared/constants/app.constants';
import { UserNamesDisplayPipe } from 'app/shared/pipes/user-names-display.pipe';
import { UserNamesPipe } from 'app/shared/pipes/user-names.pipe';

@Component({
  selector: 'app-order-user-display',
  styleUrls: ['./order-user-display.component.css'],
  template: `
    <span class="legend-light">
      {{ sharedUsers | userNames | userNamesDisplay }}
      @if (sharedUsers.length > maxUsers) {
        <span class="tooltip-trigger" (mouseenter)="isTooltipVisible = true" (mouseleave)="isTooltipVisible = false">
          ,&nbsp;
          <app-tooltip
            [showTooltip]="isTooltipVisible"
            [content]="sharedUsers | userNamesDisplay"
            [numberOfUsers]="sharedUsers.length - maxUsers">
          </app-tooltip>
        </span>
      }
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [TooltipComponent, UserNamesPipe, UserNamesDisplayPipe]
})
export class OrderUserDisplayComponent {
  @Input() sharedUsers: User[] = [];
  maxUsers = APP_CONSTANTS.MAX_USERS_IN_DISPLAY;
  isTooltipVisible = false;
}
