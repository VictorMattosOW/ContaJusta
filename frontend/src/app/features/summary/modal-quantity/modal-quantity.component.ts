import { ChangeDetectionStrategy, Component, effect, ElementRef, model, viewChild } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-modal-quantity',
  styleUrl: './modal-quantity.component.css',
  templateUrl: './modal-quantity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalQuantityComponent {
  readonly open = model<boolean>(true);
  readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  readonly dismissOnBackdrop = model(true);
  readonly dismissOnEsc = model(true);

  constructor() {
    effect(() => {
      const el = this.dialog()?.nativeElement;
      if (!el) return;
      if (this.open()) el.showModal();
      else if (el.open) el.close();
    });
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

  private close() {
    this.open.set(false);
  }
}
