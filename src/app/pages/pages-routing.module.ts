import { StartComponent } from './start/start.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './user-registration/registration.component';
import { SummaryComponent } from './summary/summary.component';

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
    path: 'resumo',
    component: SummaryComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
