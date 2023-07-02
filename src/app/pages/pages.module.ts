import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { StartComponent } from './start/start.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderComponent } from './order/order.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { RegistrationComponent } from './user-registration/registration.component';
import { SummaryComponent } from './summary/summary.component';
import { CurrencyPipe } from '../shared/pipes/currency.pipe';
import { ButtonComponent } from '../shared/components/button/button.component';
import { ButtonLinkComponent } from '../shared/components/button-link/button-link.component';
import { AutofocusDirective } from '../shared/diretivas/autofocus.directive';

@NgModule({
  declarations: [
    StartComponent,
    RegistrationComponent,
    OrderComponent,
    ButtonComponent,
    ButtonLinkComponent,
    SummaryComponent,
    AutofocusDirective,
    CurrencyPipe
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    NgxCurrencyModule,
    FormsModule,
  ],
  exports: [StartComponent, RegistrationComponent, OrderComponent, SummaryComponent, ButtonLinkComponent, ButtonComponent,]
})
export class PagesModule { }
