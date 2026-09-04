import { ActivatedRouteSnapshot } from '@angular/router';
import { AppBackground } from '../types/background.type';

/** Chave usada em `data: { ... }` das rotas para declarar o fundo da tela. */
export const BACKGROUND_DATA_KEY = 'background';

/**
 * Resolve qual background a rota ativa pede.
 *
 * Como funciona: as rotas do Angular formam uma árvore (rota raiz → filha → filha...).
 * Começamos no `root` e descemos por `firstChild` até a folha (a tela em exibição),
 * guardando o `data.background` mais profundo encontrado.
 *
 * Por que descer até a folha? Rotas-pai podem definir um fundo "de grupo"
 * (ex.: todo o fluxo /admin azul) e uma filha pode sobrescrever pontualmente.
 * Rotas sem `data.background` simplesmente herdam o valor herdado até ali.
 *
 * Se nenhuma rota da cadeia declarar nada, devolve 'default'.
 */
export function resolveRouteBackground(root: ActivatedRouteSnapshot): AppBackground {
  let current: ActivatedRouteSnapshot | null = root;
  let found: AppBackground | undefined;

  while (current) {
    const value = current.data[BACKGROUND_DATA_KEY] as AppBackground | undefined;
    if (value) found = value;
    current = current.firstChild;
  }

  return found ?? 'default';
}
