/**
 * ============================================================================
 * TESTE 10 — MOCK DE SERVIÇOS OBSERVÁVEIS COM SUBJECT + TEMPO CONTROLADO
 * ============================================================================
 *
 * O DESAFIO deste componente:
 * OrderDivisionComponent depende de TRÊS coisas injetadas:
 *   - SessionService (fornece usuários e pedido-final via Observable)
 *   - Router (redireciona quando dados estão vazios)
 *   - OrderService (faz os cálculos)
 *
 * NUNCA use os serviços reais num teste unitário! Eles trariam estado global,
 * chamadas em cadeia e tornariam a falha impossível de localizar. A técnica:
 *
 *   1. Crie Subjects "de mentira" — um Subject É um Observable que VOCÊ
 *      controla: quando chamar .next(valor), o componente recebe o valor.
 *          const usuarios$ = new Subject<User[]>();
 *          mock.getUsersObservable = () => usuarios$.asObservable();
 *   2. Forneça objetos simples com jest.fn() nos métodos (Router/OrderService).
 *   3. Nos testes, EMITA manualmente: usuarios$.next([...]).
 *
 * SOBRE fakeAsync + tick():
 * `changeBackground()` usa setTimeout(..., 0). Num teste normal esse callback
 * só rodaria depois — o assert falharia por "corrida". fakeAsync congela o
 * relógio do teste e tick() avança-o manualmente, executando timers na hora.
 * Regra: qualquer código assíncrono com timer → teste dentro de fakeAsync.
 * ============================================================================
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { OrderDivisionComponent } from './order-division.component';
import { SessionService } from 'app/shared/services/session.service';
import { OrderService } from '../../services/order.service';
import { FinalOrder, Order, OrderPerUser } from 'app/core/models/order.model';
import { User } from 'app/core/models/user.model';

describe('OrderDivisionComponent', () => {
  let component: OrderDivisionComponent;
  let fixture: ComponentFixture<OrderDivisionComponent>;

  // --- Instrumentos de controle dos mocks -----------------------------------
  let usuarios$: Subject<User[]>;
  let pedidoFinal$: Subject<FinalOrder>;
  let routerMock: { navigate: jest.Mock };
  let orderServiceMock: { calculateConsumption: jest.Mock; sumTotalOrders: jest.Mock };

  // Dados de apoio
  const ana: User = { id: 'a', name: 'Ana' };
  const bruno: User = { id: 'b', name: 'Bruno' };
  const pizza: Order = { id: 'o1', name: 'Pizza', quantity: 1, price: 100, sharedUsers: [ana] };
  const consumoFalso: OrderPerUser[] = [
    { userId: 'a', name: 'Ana', totalValue: 55, orders: [{ orderId: 'o1', food: 'Pizza', sharedValue: 55 }] }
  ];

  /**
   * Helper de montagem: cria o componente e avança o relógio para esgotar o
   * setTimeout do ngAfterViewInit. ATENÇÃO: chama tick(), portanto SÓ pode ser
   * usado dentro de fakeAsync() — que é exatamente como os testes abaixo o
   * utilizam. Nunca embrulhe este helper em fakeAsync (não se aninha!).
   */
  const criarComponente = () => {
    fixture = TestBed.createComponent(OrderDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // dispara ngOnInit + ngAfterViewInit
    tick(); // executa o setTimeout(0) pendente do changeBackground
  };

  beforeEach(async () => {
    /**
     * Tudo é RECRiado a cada teste (isolamento total):
     * - Subjects novos não "lembram" emissões do teste anterior;
     * - jest.fn() novos começam sem chamadas registradas;
     * - TestBed.resetTestingModule (automático entre testes) limpa providers.
     */
    usuarios$ = new Subject<User[]>();
    pedidoFinal$ = new Subject<FinalOrder>();
    routerMock = { navigate: jest.fn() };
    orderServiceMock = {
      calculateConsumption: jest.fn().mockReturnValue(consumoFalso),
      sumTotalOrders: jest.fn().mockReturnValue(123.45)
    };

    const sessionServiceMock = {
      getUsersObservable: () => usuarios$.asObservable(),
      getFinalOrderObservable: () => pedidoFinal$.asObservable(),
      setBackgroundColor: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [OrderDivisionComponent],
      providers: [
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: OrderService, useValue: orderServiceMock }
      ]
    }).compileComponents();
  });

  it('deve criar o componente e aplicar cor de fundo após a view', fakeAsync(() => {
    criarComponente();

    expect(component).toBeTruthy();
    // Prova que o setTimeout do changeBackground('blue') foi esvaziado pelo tick
    expect(
      (TestBed.inject(SessionService) as unknown as { setBackgroundColor: jest.Mock }).setBackgroundColor
    ).toHaveBeenCalledWith('blue');
  }));

  describe('guardas de navegação (dados ausentes)', () => {
    it('deve redirecionar para /registrar quando a lista de usuários vem vazia', fakeAsync(() => {
      criarComponente();

      usuarios$.next([]); // Act: backend "responde" sem usuários

      expect(routerMock.navigate).toHaveBeenCalledWith(['registrar']);
    }));

    it('deve redirecionar para /registrar quando o pedido final for nulo', fakeAsync(() => {
      criarComponente();

      // Cast necessário: simulamos resposta inválida que o tipo não permite
      pedidoFinal$.next(null as unknown as FinalOrder);

      expect(routerMock.navigate).toHaveBeenCalledWith(['registrar']);
    }));
  });

  describe('com dados completos', () => {
    beforeEach(fakeAsync(() => {
      // Arrange comum: componente criado e streams alimentados
      criarComponente();
      usuarios$.next([ana, bruno]);
      pedidoFinal$.next({ tax: 10, orders: [pizza] });
    }));

    it('deve calcular a divisão repassando usuários, pedidos e taxa ao serviço', () => {
      // Ordem dos argumentos importa! Este teste trava o contrato:
      expect(orderServiceMock.calculateConsumption).toHaveBeenCalledWith([ana, bruno], [pizza], 10);
      expect(component.orderPerUser).toEqual(consumoFalso); // saída do mock virou estado
    });

    it('deve expor o valor final somado pelo serviço', () => {
      expect(orderServiceMock.sumTotalOrders).toHaveBeenCalledWith([pizza], 10);
      expect(component.finalValue).toBe(123.45);
    });

    it('não deve ter navegado (fluxo feliz permanece na tela)', () => {
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });

  describe('interações da tela', () => {
    beforeEach(fakeAsync(() => criarComponente()));

    it('openCard deve alternar o estado aberto/fechado do cartão', () => {
      expect(component.cardState[0]).toBeUndefined(); // começa fechado

      component.openCard(0);
      expect(component.cardState[0]).toBe(true);

      component.openCard(0);
      expect(component.cardState[0]).toBe(false);
    });

    it('goToSummary deve navegar para /resumo', () => {
      component.goToSummary();

      expect(routerMock.navigate).toHaveBeenCalledWith(['resumo']);
    });

    it('goToStart deve navegar para /inicio', () => {
      component.goToStart();

      expect(routerMock.navigate).toHaveBeenCalledWith(['inicio']);
    });
  });
});
