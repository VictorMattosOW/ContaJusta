/**
 * ============================================================================
 * TESTE 8 — COMPONENTE DE APRESENTAÇÃO: renderizar lista e propagar eventos
 * ============================================================================
 *
 * O QUE é um "componente de apresentação" (presentational/dumb component)?
 * Aquele que só RECEBE dados via @Input e AVISA o pai via @Output — sem
 * serviços, sem roteamento, sem lógica de negócio. CardOrdersComponent é o
 * exemplo perfeito: recebe `orders`, exibe cards e emite `orderToDelete`.
 *
 * ESTRATÉGIA DE TESTE para esse tipo de componente:
 *   1. ESTADO VAZIO → nada renderizado (@if do template);
 *   2. COM DADOS    → cada informação visível aparece no lugar certo;
 *   3. INTERAÇÃO    → a ação do usuário chega ao pai com o dado correto.
 *
 * SOBRE PIPES NO TEMPLATE: o preço usa o CurrencyPipe (`| currency`). Com
 * locale padrão en-US, R$60 vira "$60.00". Em vez de fixar a formatação
 * inteira (frágil se mudarem o locale global), afirmamos apenas que o valor
 * NUMÉRICO aparece — o teste valida a LÓGICA (quantidade × preço), não o
 * formato monetário.
 * ============================================================================
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardOrdersComponent } from './card-orders.component';
import { Order } from 'app/core/models/order.model';
import { User } from 'app/core/models/user.model';

describe('CardOrdersComponent', () => {
  let component: CardOrdersComponent;
  let fixture: ComponentFixture<CardOrdersComponent>;

  const ana: User = { id: 'a', name: 'Ana' };
  const pizza: Order = {
    id: 'o1',
    name: 'Pizza',
    quantity: 2,
    price: 30,
    sharedUsers: [ana]
  };
  const suco: Order = { id: 'o2', name: 'Suco', quantity: 1, price: 8, sharedUsers: [ana] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardOrdersComponent] // importa também OrderUserDisplay + pipes
    }).compileComponents();

    fixture = TestBed.createComponent(CardOrdersComponent);
    component = fixture.componentInstance;
    // Sem detectChanges aqui de propósito: cada teste define os @Inputs
    // primeiro e chama detectChanges quando quiser renderizar.
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('não deve renderizar NADA quando a lista está vazia', () => {
    component.orders = [];
    fixture.detectChanges();

    // O template inteiro vive dentro de @if (orders.length !== 0).
    // Estado-vazio bem feito = seção ausente do DOM, nem que seja escondida.
    const secao = fixture.nativeElement.querySelector('.card-orders');
    expect(secao).toBeNull();
  });

  describe('com pedidos na lista', () => {
    beforeEach(() => {
      // Arrange compartilhado: dois pedidos renderizados antes de cada teste.
      component.orders = [pizza, suco];
      fixture.detectChanges();
    });

    it('deve renderizar um item por pedido', () => {
      const itens = fixture.nativeElement.querySelectorAll('.card-orders__item');
      expect(itens.length).toBe(2);
    });

    it('deve exibir nome e preço calculado (quantidade × preço) de cada pedido', () => {
      const html = fixture.nativeElement as HTMLElement;

      // Nome do primeiro pedido visível...
      expect(html.textContent).toContain('Pizza');
      // ...e o total da pizza (2 × 30 = 60) presente na tela.
      // Não fixamos "$60.00": locale pode mudar; o número é o contrato.
      expect(html.textContent).toContain('60');
    });

    it('deve emitir orderToDelete com o pedido clicado', () => {
      /**
       * Fluxo completo de interação:
       *   clique no botão da lixeira → deleteItem() → EventEmitter → pai.
       * Capturamos a emissão com jest.fn() e verificamos o ARGUMENTO exato:
       * o pai precisa saber QUAL pedido excluir!
       */
      const espiao = jest.fn();
      component.orderToDelete.subscribe(espiao);

      const botaoExcluir = fixture.nativeElement.querySelector<HTMLButtonElement>(
        '.card-orders__item-actions button'
      );
      botaoExcluir!.click();

      expect(espiao).toHaveBeenCalledTimes(1);
      expect(espiao).toHaveBeenCalledWith(pizza); // o primeiro card é a Pizza
    });
  });

  it('trackByOrderId deve devolver o id (chave do loop @for)', () => {
    expect(component.trackByOrderId(0, pizza)).toBe('o1');
  });
});
