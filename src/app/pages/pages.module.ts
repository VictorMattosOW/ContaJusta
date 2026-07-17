import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { StartComponent } from './start/start.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { OrderComponent } from '../features/order/components/order/order.component';
import {
  CurrencyMaskConfig,
  CurrencyMaskInputMode,
  NgxCurrencyModule,
} from 'ngx-currency';
import { RegistrationComponent } from './user-registration/registration.component';
import { SummaryComponent } from './summary/summary.component';
// import { OrderDivisionComponent } from '../features/order/components/order-division/order-division.component';
import { SharedModule } from '../shared/shared.module';

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
  inputMode: CurrencyMaskInputMode.FINANCIAL,
};

@NgModule({
  declarations: [
    StartComponent,
    RegistrationComponent,
    // OrderComponent,
    SummaryComponent,
    // OrderDivisionComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    SharedModule,
  ],
  exports: [
    StartComponent,
    RegistrationComponent,
    // OrderComponent,
    SummaryComponent,
    // OrderDivisionComponent,
  ],
})
export class PagesModule {}
