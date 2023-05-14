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


@NgModule({
  declarations: [
    StartComponent,
    UserRegistrationComponent,
    OrderComponent,
    ButtonComponent,
    ButtonLinkComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    NgxCurrencyModule, // aqui importamos o NgxCurrencyModule
  ],
  exports: [StartComponent, UserRegistrationComponent, OrderComponent, ButtonComponent, ButtonLinkComponent]
})
export class PagesModule { }
