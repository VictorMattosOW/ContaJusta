import { Routes } from '@angular/router';
import { OrderComponent } from './features/order/components/order/order/order.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/start/start.component').then((m) => m.StartComponent),
    // Tela de abertura usa o fundo de marca
    data: { background: 'primary' }
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'criar-conta',
    loadComponent: () => import('./features/auth/signup/signup.component').then((m) => m.SignupComponent)
  },
  {
    path: 'registrar',
    loadComponent: () =>
      import('./features/user-registration/registration.component').then((m) => m.RegistrationComponent),
    canMatch: [authGuard]
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./features/order/components/order/order/order.component').then((m) => m.OrderComponent),
    canMatch: [authGuard]
  },
  {
    path: 'orders/:id',
    component: OrderComponent,
    canMatch: [authGuard]
  },
  {
    path: 'resumo',
    loadComponent: () => import('./features/summary/summary.component').then((m) => m.SummaryComponent),
    canMatch: [authGuard]
  },
  {
    path: 'divisao-pedido',
    loadComponent: () =>
      import('./features/order/components/order-division/order-division.component').then(
        (m) => m.OrderDivisionComponent
      ),
    // Divisão da conta também usa o fundo de marca
    data: { background: 'primary' }
  },
  {
    path: 'evento',
    loadComponent: () => import('./features/event-name/event-name.component').then((m) => m.EventNameComponent)
    // sem data.background → usa o fundo claro padrão
  }
];
