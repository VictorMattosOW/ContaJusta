import { NgxCurrencyModule } from 'ngx-currency';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { StartComponent } from './start/start.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { OrderComponent } from './order/order.component';
import { ButtonComponent } from '../components/button/button.component';
import { ButtonLinkComponent } from '../components/button-link/button-link.component';
import { AutofocusDirective } from '../diretivas/autofocus.directive';


@NgModule({
  declarations: [
    StartComponent,
    UserRegistrationComponent,
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
  ],
  exports: [StartComponent, UserRegistrationComponent, OrderComponent, ButtonComponent, ButtonLinkComponent]
})
export class PagesModule { }
