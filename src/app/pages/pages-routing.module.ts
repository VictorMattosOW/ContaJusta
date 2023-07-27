import { StartComponent } from './start/start.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { RegistrationComponent } from './user-registration/registration.component';
import { SummaryComponent } from './summary/summary.component';
import { OrderDivisionComponent } from './order-division/order-division.component';

const routes: Routes = [
  {
    path: '',
    component: StartComponent
  },
  {
    path: 'registrar',
    component: RegistrationComponent
  },
  {
    path: 'ordens',
    component: OrderComponent
  },
  {
    path: 'ordens/:id',
    component: OrderComponent
  },
  {
    path: 'resumo',
    component: SummaryComponent
  },
  {
    path: 'divisao-pedido',
    component: OrderDivisionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
