import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderDivisionComponent } from './components/order-division/order-division.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyMaskConfig, CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';
import { OrderFormComponent } from './components/order/order-form/order-form.component';
import { OrderComponent } from './components/order/order/order.component';
import { UserCheckboxComponent } from './components/order/user-checkbox/user-checkbox.component';
import { CardOrdersComponent } from './components/order/card-orders/card-orders.component';
import { SharedModule } from 'app/shared/shared.module';
import { OrderUserDisplayComponent } from './components/order/order-user-display/order-user-display.component';

export const customCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'right',
  allowNegative: false,
  allowZero: true,
  decimal: ',',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: '.',
  nullable: true,
  min: 0,
  max: undefined,
  inputMode: CurrencyMaskInputMode.FINANCIAL
};

@NgModule({
  declarations: [
    OrderComponent,
    OrderDivisionComponent,
    OrderFormComponent,
    UserCheckboxComponent,
    CardOrdersComponent,
    OrderUserDisplayComponent
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
  ]
})
export class OrderModule {}
