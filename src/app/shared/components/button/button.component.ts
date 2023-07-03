import { Component, EventEmitter, Input, Output } from '@angular/core';

type sizeButton = 'large' | 'small' | 'full';
type StyleButton = 'primary' | 'secondary' | 'yellow-primary' | 'yellow-secondary';
@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {

  @Input() buttonTitle: string;
  @Input() isDisabled?: boolean = false;
  @Input() styleButton: StyleButton;
  @Input() size: sizeButton;
  @Output() buttonAction: EventEmitter<void> = new EventEmitter();
}
