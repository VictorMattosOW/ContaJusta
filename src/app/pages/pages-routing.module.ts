import { StartComponent } from './start/start.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { OrderComponent } from './order/order.component';

const routes: Routes = [
  {
    path: '',
    component: StartComponent
  },
  {
    path: 'userRegistration',
    component: UserRegistrationComponent
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
