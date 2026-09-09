/**
 * ============================================================================
 * TESTE 9 — PIPES NO TEMPLATE E COMPONENTE FILHO: lendo o que o pai repassa
 * ============================================================================
 *
 * DOIS CONCEITOS deste arquivo:
 *
 * 1) PIPES REAIS no teste de componente: em vez de mockar UserNamesPipe e
 *    UserNamesDisplayPipe, importamos os pipes originais (são standalone e
 *    puros — baratos). Assim validamos a COMPOSIÇÃO real do template:
 *    `sharedUsers | userNames | userNamesDisplay` deve cortar para 2 nomes
 *    e juntá-los com vírgula. Mockar aqui esconderia exatamente o bug mais
 *    provável (pipe errado/ordem trocada).
 *
 * 2) LENDO @Input DE UM COMPONENTE FILHO: quando o template passa dados para
 *    <app-tooltip [numberOfUsers]="...">, podemos inspecionar a instância
 *    do filho via debugElement:
 *        fixture.debugElement.query(By.directive(TooltipComponent))
 *          .componentInstance.numberOfUsers
 *    Isso confirma que o pai CALCULOU certo (3 usuários − 2 exibidos = 1),
 *    sem depender da renderização interna do tooltip.
 *
 * COMPORTAMENTO testado depende da constante MAX_USERS_IN_DISPLAY = 2:
 *   até 2 usuários → nomes simples, sem tooltip;
 *   3+ usuários    → mostra 2 nomes + tooltip com contagem dos demais.
 * ============================================================================
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { OrderUserDisplayComponent } from './order-user-display.component';
import { TooltipComponent } from 'app/shared/components/tooltip/tooltip.component';
import { APP_CONSTANTS } from 'app/shared/constants/app.constants';
import { User } from 'app/features/user-registration/models/user.model';

describe('OrderUserDisplayComponent', () => {
  let component: OrderUserDisplayComponent;
  let fixture: ComponentFixture<OrderUserDisplayComponent>;

  const ana: User = { id: 'a', name: 'Ana' };
  const bruno: User = { id: 'b', name: 'Bruno' };
  const carla: User = { id: 'c', name: 'Carla' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderUserDisplayComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderUserDisplayComponent);
    component = fixture.componentInstance;
  });

  describe(`com até ${APP_CONSTANTS.MAX_USERS_IN_DISPLAY} usuários`, () => {
    beforeEach(() => {
      component.sharedUsers = [ana, bruno];
      fixture.detectChanges();
    });

    it('deve exibir os nomes separados por vírgula', () => {
      // userNames corta para MAX e userNamesDisplay junta com ", "
      const legenda = fixture.nativeElement.querySelector('.legend-light');
      expect(legenda?.textContent).toContain('Ana, Bruno');
    });

    it('não deve renderizar o gatilho do tooltip', () => {
      expect(fixture.nativeElement.querySelector('.tooltip-trigger')).toBeNull();
    });
  });

  describe('com mais usuários que o máximo exibido', () => {
    beforeEach(() => {
      component.sharedUsers = [ana, bruno, carla]; // 3 > MAX(2)
      fixture.detectChanges();
    });

    it('deve renderizar o gatilho do tooltip', () => {
      expect(fixture.nativeElement.querySelector('.tooltip-trigger')).not.toBeNull();
    });

    it('deve passar ao tooltip a quantidade correta de usuários ocultos', () => {
      /**
       * A leitura é feita na INSTÂNCIA do filho: o filho já recebeu seus
       * @Inputs antes do detectChanges() anterior, portanto os valores estão
       * disponíveis para inspeção direta.
       */
      const tooltipFilho = fixture.debugElement.query(By.directive(TooltipComponent));

      expect(tooltipFilho).toBeTruthy();
      expect(tooltipFilho.componentInstance.numberOfUsers).toBe(1); // 3 − 2
    });

    it('deve alternar a visibilidade com mouseenter/mouseleave', () => {
      const gatilho = fixture.debugElement.query(By.css('.tooltip-trigger'));

      gatilho.triggerEventHandler('mouseenter', {});
      expect(component.isTooltipVisible).toBe(true);

      gatilho.triggerEventHandler('mouseleave', {});
      expect(component.isTooltipVisible).toBe(false);
    });
  });
});
