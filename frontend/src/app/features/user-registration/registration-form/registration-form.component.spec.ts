import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RegistrationFormComponent } from './registration-form.component';
import { createRegistrationFormGroup, createUserInputFormGroup } from './registration-from.factory';

describe('RegistrationFormComponent', () => {
  let component: RegistrationFormComponent;
  let fixture: ComponentFixture<RegistrationFormComponent>;

  const el = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationFormComponent);
    component = fixture.componentInstance;

    const form = createRegistrationFormGroup();
    form.controls.inputs.push(createUserInputFormGroup({ name: 'Ana', id: 'a' }));
    form.controls.inputs.push(createUserInputFormGroup({ name: 'Bruno', id: 'b' }));

    fixture.componentRef.setInput('registrationForm', form);
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });

  describe('renderização', () => {
    it('deve renderizar os inputs do form', () => {
      const inputs = el().querySelectorAll('input[type="text"]');
      expect(inputs.length).toBe(2);
    });

    it('deve preencher os inputs com os valores do form', () => {
      const inputs = el().querySelectorAll<HTMLInputElement>('input[type="text"]');
      expect(inputs[0].value).toBe('Ana');
      expect(inputs[1].value).toBe('Bruno');
    });
  });

  describe('addNewUserInput', () => {
    it('deve emitir addUser', () => {
      const spy = jest.fn();
      component.addUser.subscribe(spy);

      component.addNewUserInput();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('indexToDelete', () => {
    it('deve emitir o índice ao clicar excluir', () => {
      const spy = jest.fn();
      component.indexToDelete.subscribe(spy);

      const botoesExcluir = fixture.debugElement.queryAll(By.css('app-button-link'));
      botoesExcluir[1].triggerEventHandler('buttonAction', null);

      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('mensagens de erro', () => {
    it('não deve mostrar erros quando form está válido e intocado', () => {
      expect(el().querySelectorAll('.error-msg span')).toHaveLength(0);
    });

    it('deve mostrar erro de required quando nome está vazio e sujo', () => {
      const control = component.inputs.at(0).get('name')!;
      control.setValue('');
      control.markAsDirty();

      fixture.detectChanges();

      const msg = el().querySelectorAll('.error-msg span')[0];
      expect(msg?.textContent).toContain('em branco');
    });

    it('deve mostrar erro de maxlength quando nome é longo demais', () => {
      const control = component.inputs.at(0).get('name')!;
      control.setValue('x'.repeat(26));
      control.markAsDirty();

      fixture.detectChanges();

      const msg = el().querySelector('.error-msg span');
      expect(msg?.textContent).toContain('25 caracteres');
    });
  });
});
