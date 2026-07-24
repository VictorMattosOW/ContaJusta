import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-button-link',
    templateUrl: './button-link.component.html',
    styleUrls: ['./button-link.component.css'],
    standalone: false
})
export class ButtonLinkComponent {
  @Input() title = '';
  @Output() buttonAction: EventEmitter<void> = new EventEmitter();
}
