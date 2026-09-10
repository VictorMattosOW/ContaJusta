import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCheckboxComponent } from './user-checkbox.component';
import { User } from 'app/features/user-registration/models/user.model';

describe('UserCheckboxComponent', () => {
  let component: UserCheckboxComponent;
  let fixture: ComponentFixture<UserCheckboxComponent>;

  const ana: User = { id: 'a', name: 'Ana' };
  const bruno: User = { id: 'b', name: 'Bruno' };

  const changeEvent = (checked: boolean): Event => {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = checked;

    const evento = new Event('change');
    Object.defineProperty(evento, 'target', { value: input, configurable: true });
    return evento;
  };

  const setUsersList = (users: User[] = [ana, bruno]) => {
    fixture.componentRef.setInput('usersList', users);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCheckboxComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserCheckboxComponent);
    component = fixture.componentInstance;
    setUsersList();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar um checkbox por usuário + o de "Selecionar todos"', () => {
    const checkboxes = fixture.nativeElement.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    expect(checkboxes.length).toBe(3);
  });

  it('deve marcar o checkbox do usuário quando ele está em selectedUsers', () => {
    fixture.componentRef.setInput('selectedUsers', [ana]);
    fixture.detectChanges();

    expect(component.selectedIds().has(ana.id)).toBe(true);
    expect(component.selectedIds().has(bruno.id)).toBe(false);
  });

  describe('allSelected', () => {
    it('deve ser true quando selectedUsers contém todos os usuários', () => {
      fixture.componentRef.setInput('selectedUsers', [ana, bruno]);
      fixture.detectChanges();

      expect(component.allSelected()).toBe(true);
    });

    it('deve ser false quando seleção está vazia', () => {
      expect(component.allSelected()).toBe(false);
    });

    it('deve ser false quando a lista de usuários é vazia', () => {
      setUsersList([]);
      expect(component.allSelected()).toBe(false);
    });
  });

  describe('selectAllUser', () => {
    it('deve emitir todos os usuários ao marcar', () => {
      const emitidos: User[][] = [];
      component.selectedUsersChange.subscribe((usuarios) => emitidos.push(usuarios));

      component.selectAllUser(changeEvent(true));

      expect(emitidos.at(-1)).toEqual([ana, bruno]);
    });

    it('deve emitir lista vazia ao desmarcar', () => {
      const emitidos: User[][] = [];
      component.selectedUsersChange.subscribe((usuarios) => emitidos.push(usuarios));

      component.selectAllUser(changeEvent(false));

      expect(emitidos.at(-1)).toEqual([]);
    });
  });

  describe('toggleUser', () => {
    it('deve adicionar o usuário à seleção quando marcado', () => {
      const emitidos: User[][] = [];
      component.selectedUsersChange.subscribe((usuarios) => emitidos.push(usuarios));

      component.toggleUser(ana, changeEvent(true));

      expect(emitidos.at(-1)).toEqual([ana]);
    });

    it('deve remover o usuário da seleção quando desmarcado', () => {
      fixture.componentRef.setInput('selectedUsers', [ana, bruno]);
      fixture.detectChanges();
      const emitidos: User[][] = [];
      component.selectedUsersChange.subscribe((usuarios) => emitidos.push(usuarios));

      component.toggleUser(ana, changeEvent(false));

      expect(emitidos.at(-1)).toEqual([bruno]);
    });
  });
});
