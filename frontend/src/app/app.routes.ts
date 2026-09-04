import { Routes } from '@angular/router';
import { OrderComponent } from './features/order/components/order/order/order.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/start/start.component').then((m) => m.StartComponent),
    // Tela de abertura usa o fundo de marca
    data: { background: 'primary' }
  },
  {
    path: 'registrar',
    loadComponent: () =>
      import('./features/user-registration/registration.component').then((m) => m.RegistrationComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./features/order/components/order/order/order.component').then((m) => m.OrderComponent)
  },
  {
    path: 'orders/:id',
    component: OrderComponent
  },
  {
    path: 'resumo',
    loadComponent: () => import('./features/summary/summary.component').then((m) => m.SummaryComponent)
  },
  {
    path: 'divisao-pedido',
    loadComponent: () =>
      import('./features/order/components/order-division/order-division.component').then(
        (m) => m.OrderDivisionComponent
      ),
    // Divisão da conta também usa o fundo de marca
    data: { background: 'primary' }
  }
];
