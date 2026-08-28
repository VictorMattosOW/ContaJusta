import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-button-link',
  templateUrl: './button-link.component.html',
  styleUrls: ['./button-link.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true
})
export class ButtonLinkComponent {
  @Input() title = '';
  @Output() buttonAction: EventEmitter<void> = new EventEmitter();
}
