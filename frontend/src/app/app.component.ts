import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { filter, map } from 'rxjs';
import { resolveRouteBackground } from './shared/utils/route-background.utils';
import { AppBackground } from './shared/types/background.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [RouterOutlet, NgClass]
})
export class AppComponent {
  private readonly router = inject(Router);
  title = 'contaJusta';

  /**
   * Fundo da aplicação derivado da rota ativa.
   *
   * Por que escutar router.events: cada `NavigationEnd` significa "a navegação
   * terminou e a árvore de rotas já está estável" — momento seguro para ler o
   * snapshot da rota e extrair o `data.background` declarado em app.routes.ts.
   *
   * `toSignal` converte esse stream em signal (sem subscribe/unsubscribe manual):
   * qualquer nova navegação re-dispara o cálculo e atualiza a tela sozinho.
   */
  private readonly routeBackground = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => resolveRouteBackground(this.router.routerState.snapshot.root))
    ),
    { initialValue: 'default' as AppBackground }
  );

  /**
   * Classe CSS final aplicada no container. Computed separa "o qual é o fundo"
   * de "qual classe CSS representa isso" — se a convenção de nome de classe
   * mudar, só esta linha muda.
   */
  readonly containerClass = computed(() => `bg--${this.routeBackground()}`);
}
