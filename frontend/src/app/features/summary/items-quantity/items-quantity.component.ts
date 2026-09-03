import { ChangeDetectionStrategy, Component, computed, model, output } from '@angular/core';
import { ButtonComponent } from 'app/shared/components/button/button.component';

@Component({
  selector: 'app-items-quantity',
  styleUrl: './items-quantity.component.css',
  templateUrl: './items-quantity.component.html',
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsQuantityComponent {
  orderQuantity = model<number>(1);
  close = output<number>();

  readonly isMinQuantity = computed(() => this.orderQuantity() <= 1);

  confirmed() {
    this.close.emit(this.orderQuantity());
  }

  addQuantity() {
    this.orderQuantity.update((v) => v + 1);
  }

  subtractQuantity() {
    if (!this.isMinQuantity()) {
      this.orderQuantity.update((v) => v - 1);
    }
  }
}
