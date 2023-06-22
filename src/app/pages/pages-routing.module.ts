import { StartComponent } from './start/start.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { RegistrationComponent } from './user-registration/registration.component';

const routes: Routes = [
  {
    path: '',
    component: StartComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'order',
    component: OrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
