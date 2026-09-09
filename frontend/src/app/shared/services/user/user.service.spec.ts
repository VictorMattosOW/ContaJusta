import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { User } from 'app/features/user-registration/models/user.model';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('gerenciamento de pedidos (signals)', () => {
    it('deve iniciar com a lista de pedidos vazia', () => {
      expect(service.users$()).toEqual([]);
    });

    it('deve adicionar usuarios', () => {
      const user: User[] = [{ id: '1', name: 'victor' }];
      const retorno = service.addUser(user);

      expect(retorno[0].id).toEqual(user[0].id);
      expect(retorno[0].name).toEqual(user[0].name);
    });

    it('deve remover usuarios pelo id', () => {
      const users: User[] = [
        { id: '1', name: 'victor' },
        { id: '2', name: 'victor' }
      ];
      service.addUser(users);

      service.removeUser(users[1].id);

      const restantes = service.users$();
      expect(restantes).toHaveLength(1);
      expect(restantes[0].name).toEqual(users[0].name);
    });

    it('deve substituir usuario com mesmo id', () => {
      const users: User[] = [
        { id: '1', name: 'victor' },
        { id: '2', name: 'victor' }
      ];
      service.addUser(users);

      const user: User = { id: '2', name: 'victor matttosss' };
      service.updateUser(user);

      const restantes = service.users$();
      expect(restantes).toHaveLength(2);
      expect(restantes.find((u) => u.id === user.id)).toMatchObject({
        name: 'victor matttosss'
      });
    });

    it('resetUser deve esvaziar a lista', () => {
      const users: User[] = [
        { id: '1', name: 'victor' },
        { id: '2', name: 'victor' }
      ];
      service.addUser(users);

      service.resetUser();

      expect(service.users$()).toEqual([]);
    });
  });
});
