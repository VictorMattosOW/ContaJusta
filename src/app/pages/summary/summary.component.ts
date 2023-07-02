import { Component, ElementRef, ViewChild } from '@angular/core';
import { Order } from 'src/app/shared/models/order.model';
import { AbstractComponent } from 'src/app/shared/utils/abstract.component';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent extends AbstractComponent {
  @ViewChild('dialog') dialogElement!: ElementRef<HTMLDialogElement>;

  activeIndex: number | null = null;
  orders: Order[] = [
    {
      id: '',
      name: 'polenta',
      price: 14.90,
      quantity: 1,
      sharedUsers: [{id: '', name: 'victor'}]
    },
    {
      id: '',
      name: 'polenta',
      price: 14.90,
      quantity: 1,
      sharedUsers: [{id: '', name: 'victor'}]
    },
        {
      id: '',
      name: 'polenta',
      price: 14.90,
      quantity: 1,
      sharedUsers: [{id: '', name: 'victor'}]
    },
  ];

  constructor() {
    super();
  }

  openDialog(): void {
    this.dialogElement.nativeElement.show();
  }

  closeDialog(): void {
    this.dialogElement.nativeElement.close();
  }

}
