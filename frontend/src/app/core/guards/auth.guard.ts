import { inject } from '@angular/core';
import { CanMatchFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from 'app/features/auth/services/auth.service';

/**
 * Protege a navegação para rotas autenticadas.
 *
 * Usado como `canMatch` (e não `canActivate`): o guard roda ANTES do Angular
 * baixar o componente lazy — quem não está logado nem faz o download da página
 * protegida. Para rotas `loadComponent`, isso economiza uma carga de rede.
 *
 * A verificação é síncrona: lê o signal do AuthService (derivado do token).
 * Não há chamada HTTP aqui — por isso, depois do login ter atualizado o token,
 * o guard responde na hora, sem delay.
 */
export const authGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return new RedirectCommand(router.parseUrl('/'), { skipLocationChange: false });
};
