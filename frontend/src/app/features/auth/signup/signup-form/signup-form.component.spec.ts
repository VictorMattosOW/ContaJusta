import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupFormComponent } from './signup-form.component';
import { createSignupFormGroup } from './signup-form.factory';

describe('SignupFormComponent', () => {
  let component: SignupFormComponent;
  let fixture: ComponentFixture<SignupFormComponent>;

  const el = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupFormComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('signupForm', createSignupFormGroup());
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });

  describe('renderização', () => {
    it('deve renderizar os inputs de nome, e-mail e senha', () => {
      expect(el().querySelectorAll('input[type="text"]').length).toBe(1);
      expect(el().querySelectorAll('input[type="email"]').length).toBe(1);
      expect(el().querySelectorAll('input[type="password"]').length).toBe(1);
    });
  });

  describe('mensagens de erro', () => {
    it('não deve mostrar erros quando form está válido e intocado', () => {
      expect(el().querySelectorAll('.error-msg span')).toHaveLength(0);
    });

    it('deve mostrar erro de required quando nome está vazio e sujo', () => {
      const control = component.signupForm().controls['name'];
      control.setValue('');
      control.markAsDirty();

      fixture.detectChanges();

      const msg = el().querySelectorAll('.error-msg span')[0];
      expect(msg?.textContent).toContain('em branco');
    });

    it('deve mostrar erro de maxlength quando nome é longo demais', () => {
      const control = component.signupForm().controls['name'];
      control.setValue('x'.repeat(26));
      control.markAsDirty();

      fixture.detectChanges();

      const msg = el().querySelector('.error-msg span');
      expect(msg?.textContent).toContain('25 caracteres');
    });

    it('deve mostrar erro de email inválido quando e-mail está sujo', () => {
      const control = component.signupForm().controls['email'];
      control.setValue('email-invalido');
      control.markAsDirty();

      fixture.detectChanges();

      const msg = el().querySelector('.error-msg span');
      expect(msg?.textContent).toContain('e-mail válido');
    });

    it('deve mostrar erro de minlength quando senha é curta demais', () => {
      const control = component.signupForm().controls['password'];
      control.setValue('123');
      control.markAsDirty();

      fixture.detectChanges();

      const msg = el().querySelector('.error-msg span');
      expect(msg?.textContent).toContain('mínimo');
    });
  });
});
