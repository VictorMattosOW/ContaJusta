/**
 * ============================================================================
 * TESTE 7 — @Output (EventEmitter), SETTER INPUT E EVENTOS DE CHECKBOX
 * ============================================================================
 *
 * TRÊS CONCEITOS NOVOS neste arquivo:
 *
 * 1) TESTANDO @Output: um EventEmitter é, na prática, um Observable. Para
 *    "ouvir" o que o componente emite, inscreva-se ANTES do ato:
 *        const espiao = jest.fn();
 *        component.selectedUserList.subscribe(espiao);
 *        component.selectAllUser(eventoFalso(true));
 *        expect(espiao).toHaveBeenCalledWith([...]);
 *    Alternativa (mais acoplada ao template) seria ouvir via debugElement;
 *    a inscrição direta é mais simples e igualmente eficaz.
 *
 * 2) SETTER INPUT (`@Input() set resetTrigger`): como é apenas uma property
 *    com getter/setter, atribuir `component.resetTrigger = 1` já executa a
 *    lógica — não precisa passar pelo template.
 *
 * 3) SIMULANDO EVENTOS DE DOM: os handlers esperam objetos Event com
 *    `.target.checked`. Criar um objeto literal com essa forma e fazer cast
 *    (`as unknown as Event`) é mais direto e legível que construir
 *    HTMLInputElement de verdade. Testes unitários podem "mentir" sobre tipos
 *    quando só a forma importada importa.
 * ============================================================================
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCheckboxComponent } from './user-checkbox.component';
import { User } from 'app/features/user-registration/models/user.model';

describe('UserCheckboxComponent', () => {
  let component: UserCheckboxComponent;
  let fixture: ComponentFixture<UserCheckboxComponent>;

  /** Usuários-exemplo que serão "renderizados" como checkboxes. */
  const ana: User = { id: 'a', name: 'Ana' };
  const bruno: User = { id: 'b', name: 'Bruno' };

  /**
   * Fábrica de evento REAL: o componente usa `event instanceof Event` para
   * decidir como ler o valor, então um objeto literal `{ target: ... }` não
   * serve (não passa no instanceof!). Criamos um Event de verdade via
   * createElement + defineProperty para sobrescrever o `target` (somente
   * leitura no Event nativo) com um input cujo `.checked` controlamos.
   */
  const changeEvent = (checked: boolean): Event => {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = checked;

    const evento = new Event('change');
    Object.defineProperty(evento, 'target', { value: input, configurable: true });
    return evento;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCheckboxComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserCheckboxComponent);
    component = fixture.componentInstance;
    // @Input com default [] — aqui fornecemos dados reais para os testes,
    // como faria o componente pai (OrderComponent).
    component.usersList = [ana, bruno];
    fixture.detectChanges(); // renderiza os checkboxes no DOM
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar um checkbox por usuário + o de "Selecionar todos"', () => {
    /**
     * Primeira asserção de RENDERIZAÇÃO condicional: 2 usuários + 1 checkbox
     * "todos" = 3 inputs. Se alguém quebrar o loop @for do template, este
     * teste detecta imediatamente.
     */
    const checkboxes = fixture.nativeElement.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    expect(checkboxes.length).toBe(3);
  });

  describe('selectAllUser', () => {
    it('deve marcar todos os usuários e emitir a lista completa', () => {
      const emitidos: User[][] = [];
      component.selectedUserList.subscribe((usuarios) => emitidos.push(usuarios));

      component.selectAllUser(changeEvent(true)); // Act

      expect(component.sharedFood).toEqual([ana, bruno]); // estado interno
      expect(component.markAllUsers).toBe(true); // checkbox visual sincronizado
      expect(emitidos[emitidos.length - 1]).toEqual([ana, bruno]); // último emit
    });

    it('deve limpar tudo ao desmarcar "selecionar todos"', () => {
      component.selectAllUser(changeEvent(true)); // prepara estado cheio

      component.selectAllUser(changeEvent(false));

      expect(component.sharedFood).toEqual([]);
      expect(component.markAllUsers).toBe(false);
    });
  });

  describe('selectedUser (individual)', () => {
    it('deve adicionar o usuário à seleção quando marcado via Event', () => {
      const emitidos: User[][] = [];
      component.selectedUserList.subscribe((usuarios) => emitidos.push(usuarios));

      component.selectedUser(0, changeEvent(true)); // Ana marcada

      expect(component.sharedFood).toEqual([ana]);
      expect(component.selectedUsers[0]).toBe(true); // flag do ngModel
      expect(emitidos.at(-1)).toEqual([ana]);
    });

    it('deve remover o usuário da seleção quando desmarcado', () => {
      component.selectedUser(0, changeEvent(true));
      component.selectedUser(1, changeEvent(true)); // [Ana, Bruno]

      component.selectedUser(0, false); // Ana desmarcada...

      expect(component.sharedFood).toEqual([bruno]); // ...sobra Bruno
    });

    it('deve aceitar boolean direto (sem Event)', () => {
      /**
       * O handler aceita `Event | boolean` por causa do `instanceof Event`.
       * Testar as DUAS formas trava o contrato público do método — se alguém
       * remover o suporte a boolean, este teste avisa.
       */
      component.selectedUser(1, true);

      expect(component.sharedFood).toEqual([bruno]);
    });
  });

  describe('resetTrigger (setter input)', () => {
    it('deve limpar a seleção e emitir [] quando receber valor truthy', () => {
      component.selectedUser(0, true); // estado prévio: Ana selecionada
      const emitidos: User[][] = [];
      component.selectedUserList.subscribe((usuarios) => emitidos.push(usuarios));

      // Atribuição simples dispara o setter — sem precisar do template!
      component.resetTrigger = 1;

      expect(component.markAllUsers).toBe(false);
      expect(component.sharedFood).toEqual([]);
      expect(emitidos.at(-1)).toEqual([]);
    });

    it('NÃO deve resetar quando o valor for falsy (0 inicial)', () => {
      /**
       * O guard `if (value)` evita que o valor INICIAL (0) dispare um reset
       * espúrio logo na primeira renderização. Este teste protege exatamente
       * esse detalhe — sem ele, alguém poderia "simplificar" o if e quebrar
       * a tela silenciosamente.
       */
      component.selectedUser(0, true);

      component.resetTrigger = 0;

      expect(component.sharedFood).toEqual([ana]); // nada mudou
    });
  });

  it('trackByUserId deve devolver o id (otimização do @for)', () => {
    /**
     * trackBy ajuda o Angular a reaproveitar nós do DOM em vez de recriá-los.
     * O teste é trivial, mas garante que a função existe e retorna a chave
     * certa — se sumir do template/track, o build do template falha; se mudar
     * a chave, este teste falha.
     */
    expect(component.trackByUserId(0, ana)).toBe('a');
  });
});
