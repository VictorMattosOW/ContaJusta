import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { StartComponent } from './start/start.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderComponent } from './order/order.component';
import { ButtonComponent } from '../components/button/button.component';
import { ButtonLinkComponent } from '../components/button-link/button-link.component';
import { AutofocusDirective } from '../diretivas/autofocus.directive';
import { NgxCurrencyModule } from 'ngx-currency';
import { RegistrationComponent } from './user-registration/registration.component';


@NgModule({
  declarations: [
    StartComponent,
    RegistrationComponent,
    OrderComponent,
    ButtonComponent,
    ButtonLinkComponent,
    AutofocusDirective
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    NgxCurrencyModule,
    FormsModule,
  ],
  exports: [StartComponent, RegistrationComponent, OrderComponent, ButtonLinkComponent, ButtonComponent]
})
export class PagesModule { }
