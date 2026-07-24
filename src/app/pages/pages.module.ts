import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { StartComponent } from './start/start.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCurrencyConfig, NgxCurrencyInputMode, NgxCurrencyDirective, provideEnvironmentNgxCurrency } from 'ngx-currency';
import { RegistrationComponent } from './user-registration/registration.component';
import { SummaryComponent } from './summary/summary.component';
import { SharedModule } from '../shared/shared.module';

export const customCurrencyMaskConfig: NgxCurrencyConfig = {
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
  inputMode: NgxCurrencyInputMode.Financial
};

@NgModule({
  declarations: [
    StartComponent,
    RegistrationComponent,
    // OrderComponent,
    SummaryComponent
    // OrderDivisionComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NgxCurrencyDirective,
    SharedModule
  ],
  providers: [provideEnvironmentNgxCurrency(customCurrencyMaskConfig)],
  exports: [
    StartComponent,
    RegistrationComponent,
    // OrderComponent,
    SummaryComponent
    // OrderDivisionComponent,
  ]
})
export class PagesModule {}
