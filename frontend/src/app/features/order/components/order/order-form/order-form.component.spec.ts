/**
 * ============================================================================
 * TESTE 6 — COMPONENTE STANDALONE COM @Input OBRIGATÓRIO E VERIFICAÇÃO DE DOM
 * ============================================================================
 *
 * ⚠️ ERRO CLÁSSICO QUE ESTE ARQUIVO CORRIGE:
 * O spec gerado pelo CLI antigo usava `declarations: [OrderFormComponent]`.
 * Em componentes STANDALONE isso quebra — o correto é `imports:`. Componente
 * standalone se importa como se fosse um módulo, pois ele mesmo é seu módulo.
 *
 * O DESAFIO deste componente:
 * Ele recebe o FormGroup por @Input (`orderForm!`). Sem fornecer esse input
 * ANTES da primeira renderização, o template explode com "cannot read
 * controls of undefined". A ordem correta do setup é:
 *
 *   1) createComponent()          → cria a instância da classe (sem renderizar)
 *   2) component.orderForm = ...  → satisfaz o @Input obrigatório
 *   3) fixture.detectChanges()    → SÓ AGORA renderiza o template
 *
 * SOBRE OnPush (changeDetection): este componente usa ChangeDetectionStrategy.
 * OnPush, ou seja, só re-renderiza quando entradas mudam OU detectChanges()
 * é chamado manualmente. Nos testes, sempre chamamos fixture.detectChanges()
 * depois de alterar estado do form para forçar o template a atualizar.
 *
 * DUAS CAMADAS de asserção usadas aqui:
 *   - LÓGICA: chamar métodos direto (isFormValid, updateQuantity) — rápido;
 *   - TELA: consultar o DOM renderizado (mensagens, botão desabilitado) —
 *     garante que o HTML reflete o estado (bindings corretos).
 * ============================================================================
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { OrderFormComponent } from './order-form.component';
import { createOrderFormGroup } from './order-form.factory';
import { ORDER_FORM_CONSTANTS } from '../../../models/order-form.constants';

describe('OrderFormComponent', () => {
  let component: OrderFormComponent;
  let fixture: ComponentFixture<OrderFormComponent>;

  /** Atalho para ler elementos do DOM já tipados (evita cast repetitivo). */
  const el = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderFormComponent] // ← standalone: IMPORTS, nunca declarations!
    }).compileComponents();

    fixture = TestBed.createComponent(OrderFormComponent);
    component = fixture.componentInstance;
    // Passo crucial: injetar o FormGroup ANTES do primeiro detectChanges().
    // Usamos a factory real em vez de um mock — assim testamos a integração
    // component ↔ form exatamente como acontece na aplicação.
    component.orderForm = createOrderFormGroup();
    fixture.detectChanges(); // primeiro render
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  // ===========================================================================
  // PARTE 1 — LÓGICA PURA (sem DOM)
  // ===========================================================================
  describe('isFormValid (lógica)', () => {
    /**
     * isFormValid() controla a EXIBIÇÃO dos erros: só mostra erro se o campo
     * estiver "sujo" (usuário já digitou algo) E inválido. Isso evita mostrar
     * mensagens vermelhas antes de o usuário tocar no campo (UX!).
     */

    it('não deve considerar inválido enquanto o campo está intocado (pristine)', () => {
      expect(component.isFormValid()).toBe(false);
    });

    it('deve considerar inválido quando o campo está sujo e vazio', () => {
      const foodName = component.orderForm.controls.foodName;
      foodName.setValue('Pizza'); // válido...
      foodName.markAsDirty();

      expect(component.isFormValid()).toBe(false); // ...então não é "erro"

      foodName.setValue(''); // agora sujo E inválido
      expect(component.isFormValid()).toBe(true);
    });
  });

  describe('updateQuantity (lógica)', () => {
    it('deve incrementar a quantidade', () => {
      component.updateQuantity('add');
      expect(component.orderForm.controls.quantity.value).toBe(2);
    });

    it('deve decrementar sem descer abaixo do mínimo', () => {
      // Quantidade inicial = 1 (mínima). Decrementar deve ser IGNORADO,
      // não permitir 0 ou negativo — regra de negócio travada no componente.
      component.updateQuantity('subtract');
      expect(component.orderForm.controls.quantity.value).toBe(ORDER_FORM_CONSTANTS.MIN_QUANTITY);
    });

    it('não deve emitir eventos ao alterar quantidade (emitEvent: false)', () => {
      /**
       * POR QUÊ isso importa? O componente pai escuta statusChanges do form.
       * updateQuantity usa { emitEvent: false } para NÃO disparar essa escuta
       * a cada clique no "+". Testamos observando o stream de eventos do
       * controle (Angular ≥18 expõe `control.events`) e garantindo silêncio.
       */
      const espiao = jest.fn();
      component.orderForm.controls.quantity.events.subscribe(espiao);

      component.updateQuantity('add');

      expect(espiao).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // PARTE 2 — TELA (DOM renderizado)
  // ===========================================================================
  describe('renderização das mensagens de erro', () => {
    it('deve mostrar mensagem de campo obrigatório após o usuário limpar o nome', () => {
      // Simula o fluxo real: usuário digitou (dirty) e apagou (inválido).
      const foodName = component.orderForm.controls.foodName;
      foodName.setValue('algo');
      foodName.markAsDirty();
      foodName.setValue('');

      fixture.detectChanges(); // OnPush: força re-render do template

      const paragrafoErro = el().querySelector('.order-form__error p');
      expect(paragrafoErro?.textContent).toContain('em branco');
    });

    it('deve mostrar mensagem de maxlength quando o nome é longo demais', () => {
      const foodName = component.orderForm.controls.foodName;
      foodName.setValue('x'.repeat(ORDER_FORM_CONSTANTS.MAX_LENGTH_FOOD_NAME + 1));
      foodName.markAsDirty();

      fixture.detectChanges();

      expect(el().querySelector('.order-form__error p')?.textContent).toContain(
        `${ORDER_FORM_CONSTANTS.MAX_LENGTH_FOOD_NAME} caracteres`
      );
    });

    it('não deve renderizar nenhum erro enquanto o form está válido e intocado', () => {
      // Estado inicial (pristine + quantity=1 válida): zero parágrafos de erro.
      expect(el().querySelectorAll('.order-form__error p')).toHaveLength(0);
    });
  });

  describe('botões de quantidade (integração DOM → método)', () => {
    it('deve iniciar com botão "-" desabilitado na quantidade mínima', () => {
      const btnMenos = el().querySelector<HTMLButtonElement>('.order-form__button--decrement');

      // [disabled] no template reflete-se na propriedade .disabled do elemento
      expect(btnMenos?.disabled).toBe(true);
    });

    it('deve aumentar a quantidade ao clicar em "+"', () => {
      // triggerEventHandler dispara o binding Angular (click)="..."
      // de forma síncrona — mais confiável que simular MouseEvent nativo.
      const btnMais = fixture.debugElement.query(By.css('.order-form__button--increment'));

      btnMais.triggerEventHandler('click', null);
      fixture.detectChanges(); // OnPush de novo: atualiza o input na tela

      expect(component.orderForm.controls.quantity.value).toBe(2);
      expect(el().querySelector<HTMLInputElement>('.order-form__input--quantity')?.value).toBe('2');
    });

    it('deve habilitar o botão "-" após aumentar a quantidade', () => {
      /**
       * DETALHE FINO de OnPush: aqui NÃO chamamos updateQuantity() direto —
       * chamar o método não marca a view como "suja", e o binding [disabled]
       * não reavaliaria. Simular o clique via triggerEventHandler passa pelo
       * mecanismo de eventos do Angular, que já agenda a atualização da view.
       * Lição: para testar REFLEXOS no template sob OnPush, interaja como a
       * tela interage.
       */
      const btnMais = fixture.debugElement.query(By.css('.order-form__button--increment'));
      btnMais.triggerEventHandler('click', null);
      fixture.detectChanges();

      const btnMenos = el().querySelector<HTMLButtonElement>('.order-form__button--decrement');
      expect(btnMenos?.disabled).toBe(false);
    });
  });
});
