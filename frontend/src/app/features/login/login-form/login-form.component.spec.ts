import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormComponent } from './login-form.component';
import { createLoginFormGroup } from './login-form.factory';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  const el = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('loginForm', createLoginFormGroup());
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });

  describe('renderização', () => {
    it('deve renderizar os inputs de e-mail e senha', () => {
      expect(el().querySelectorAll('input[type="email"]').length).toBe(1);
      expect(el().querySelectorAll('input[type="password"]').length).toBe(1);
    });
  });

  describe('mensagens de erro', () => {
    it('não deve mostrar erros quando form está válido e intocado', () => {
      expect(el().querySelectorAll('.error-msg span')).toHaveLength(0);
    });

    it('deve mostrar erro de email inválido quando e-mail está sujo', () => {
      const control = component.loginForm().controls['email'];
      control.setValue('email-invalido');
      control.markAsDirty();

      fixture.detectChanges();

      const msg = el().querySelector('.error-msg span');
      expect(msg?.textContent).toContain('e-mail válido');
    });

    it('deve mostrar erro de required quando senha está vazia e suja', () => {
      const control = component.loginForm().controls['password'];
      control.setValue('');
      control.markAsDirty();

      fixture.detectChanges();

      const msg = el().querySelector('.error-msg span');
      expect(msg?.textContent).toContain('em branco');
    });

    it('deve mostrar erro de minlength quando senha é curta demais', () => {
      const control = component.loginForm().controls['password'];
      control.setValue('123');
      control.markAsDirty();

      fixture.detectChanges();

      const msg = el().querySelector('.error-msg span');
      expect(msg?.textContent).toContain('mínimo');
    });
  });
});
