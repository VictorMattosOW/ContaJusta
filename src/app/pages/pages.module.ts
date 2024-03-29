import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { StartComponent } from './start/start.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderComponent } from './order/order.component';
import { CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';
import { RegistrationComponent } from './user-registration/registration.component';
import { SummaryComponent } from './summary/summary.component';
import { CurrencyPipe } from '../shared/pipes/currency.pipe';
import { ButtonComponent } from '../shared/components/button/button.component';
import { ButtonLinkComponent } from '../shared/components/button-link/button-link.component';
import { AutofocusDirective } from '../shared/diretivas/autofocus.directive';
import { TooltipComponent } from '../shared/components/tooltip/tooltip.component';
import { OrderDivisionComponent } from './order-division/order-division.component';

export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: false,
  allowZero: true,
  decimal: ",",
  precision: 2,
  prefix: "",
  suffix: "",
  thousands: ".",
  nullable: true,
  min: null,
  max: null,
  inputMode: CurrencyMaskInputMode.FINANCIAL
};

@NgModule({
  declarations: [
    StartComponent,
    RegistrationComponent,
    OrderComponent,
    ButtonComponent,
    ButtonLinkComponent,
    SummaryComponent,
    AutofocusDirective,
    CurrencyPipe,
    TooltipComponent,
    OrderDivisionComponent,
    OrderDivisionComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
  ],
  exports: [StartComponent, RegistrationComponent, OrderComponent, SummaryComponent, ButtonLinkComponent, ButtonComponent, TooltipComponent, OrderDivisionComponent]
})
export class PagesModule { }
