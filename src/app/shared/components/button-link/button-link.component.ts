import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-link',
  templateUrl: './button-link.component.html',
  styleUrls: ['./button-link.component.css']
})
export class ButtonLinkComponent {

  @Input() title: string;
  @Output() buttonAction: EventEmitter<void> = new EventEmitter();
}
