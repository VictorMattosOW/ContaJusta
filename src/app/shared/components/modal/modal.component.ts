import { ChangeDetectionStrategy, Component, effect, ElementRef, input, model, output, viewChild } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-modal',
  imports: [ButtonComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {
  readonly open = model<boolean>(false);
  readonly title = model<string>('');
  readonly dismissOnBackdrop = model(true);
  readonly dismissOnEsc = model(true);

  readonly loading = input<boolean>(false);

  readonly dismiss = output<void>();
  readonly confirm = output<void>();
  readonly cancel = output<void>();

  readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const el = this.dialog()?.nativeElement;
      if (!el) return;
      if (this.open()) el.showModal();
      else if (el.open) el.close();
    })
  }

  onBackdrop(e: MouseEvent) {
    if (this.dismissOnBackdrop() && e.target === this.dialog().nativeElement) {
      this.close();
    }
  }

  onKey(e: KeyboardEvent) {
    if (this.dismissOnEsc() && e.key === 'Escape') {
      this.close();
    }
  }

  onCancel() {
    this.cancel.emit();
    this.close();
  }

  onConfirm() {
    this.confirm.emit();
  }

  private close() {
    this.open.set(false);
    this.dismiss.emit();
  }
}
