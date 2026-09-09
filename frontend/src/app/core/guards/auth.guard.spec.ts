import { TestBed } from '@angular/core/testing';
import { RedirectCommand, Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from 'app/features/auth/services/auth.service';

describe('authGuard', () => {
  function runGuard(isAuthenticated: boolean) {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { isAuthenticated: () => isAuthenticated } },
        { provide: Router, useValue: { parseUrl: (path: string) => path } }
      ]
    });

    return TestBed.runInInjectionContext(() => authGuard({}, []));
  }

  it('permite a navegação quando autenticado', () => {
    expect(runGuard(true)).toBe(true);
  });

  it('redireciona para a home quando deslogado', () => {
    expect(runGuard(false)).toBeInstanceOf(RedirectCommand);
  });
});
