import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Input() buttonTitle: string;
  @Input() isDisabled?: boolean = false;
  @Input() styleButton: 'primary' | 'secundary' | 'yellow-primary' | 'yellow-secundary';
  @Output() buttonAction: EventEmitter<void> = new EventEmitter();
}
