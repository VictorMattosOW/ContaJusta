// src/app/features/user-registration/registration-form/registration-form.model.spec.ts

import { User } from 'app/features/user-registration/models/user.model';
import { RegistrationFormModel } from './registration-form.model';

const userA: User = { id: 'a', name: 'Ana' };
const userB: User = { id: 'b', name: 'Bruno' };

describe('RegistrationFormModel', () => {
  let model: RegistrationFormModel;

  beforeEach(() => {
    model = new RegistrationFormModel();
  });

  it('começa com FormArray vazio e sem capacidade de submit', () => {
    expect(model.inputs.length).toBe(0);
    expect(model.canEnableSubmitButton()).toBe(false);
  });

  describe('addNewUserInput', () => {
    it('adiciona um usuário ao form', () => {
      model.addNewUserInput(userA);
      expect(model.inputs.length).toBe(1);
    });

    it('gera id automaticamente quando não recebe usuário', () => {
      model.addNewUserInput();
      const id = model.inputs.at(0).get('id')?.value;
      expect(id).toBeTruthy();
      expect(typeof id).toBe('string');
    });

    it('usa dados do usuário quando recebido', () => {
      model.addNewUserInput(userA);
      expect(model.inputs.at(0).get('name')?.value).toBe('Ana');
      expect(model.inputs.at(0).get('id')?.value).toBe('a');
    });
  });

  describe('removeUserInput', () => {
    it('remove pelo índice', () => {
      model.addNewUserInput(userA);
      model.addNewUserInput(userB);
      model.removeUserInput(0);
      expect(model.inputs.length).toBe(1);
      expect(model.inputs.at(0).get('name')?.value).toBe('Bruno');
    });
  });

  describe('canEnableSubmitButton', () => {
    it('false com menos de 2 usuários', () => {
      model.addNewUserInput(userA);
      expect(model.canEnableSubmitButton()).toBe(false);
    });

    it('true com 2+ usuários válidos', () => {
      model.addNewUserInput(userA);
      model.addNewUserInput(userB);
      expect(model.canEnableSubmitButton()).toBe(true);
    });
  });

  describe('buildSubmitPayload', () => {
    it('retorna User[] a partir do form', () => {
      model.addNewUserInput(userA);
      model.addNewUserInput(userB);
      expect(model.buildSubmitPayload()).toEqual([userA, userB]);
    });
  });

  describe('reset', () => {
    it('limpa o FormArray', () => {
      model.addNewUserInput(userA);
      model.addNewUserInput(userB);
      model.reset();
      expect(model.inputs.length).toBe(0);
    });
  });
});
