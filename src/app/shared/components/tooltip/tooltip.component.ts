import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class TooltipComponent {
  @Input() showTooltip = false;
  @Input() content = '';
  @Input() numberOfUsers = 0;
}
