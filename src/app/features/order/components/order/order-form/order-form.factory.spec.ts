/**
 * ============================================================================
 * TESTE 2 — VALIDAÇÃO DE REACTIVE FORMS, SEM COMPONENTE E SEM DOM
 * ============================================================================
 *
 * POR QUÊ?
 * A factory `createOrderFormGroup()` centraliza TODAS as regras de validação
 * do formulário (obrigatório, tamanho máximo, valor mínimo). Testá-la
 * isoladamente traz dois benefícios:
 *
 *   1. VELOCIDADE: não montamos componente, nem template, nem detecção de
 *      mudança. O teste é tão rápido quanto o das funções puras.
 *   2. PRECISÃO: se a validação quebrar, este arquivo aponta para a factory;
 *      se a EXIBIÇÃO da validação quebrar (mensagens na tela), quem falha é
 *      o spec do COMPONENTE. Cada teste responsabiliza um único lugar.
 *
 * COMO?
 * FormGroup/FormControl são classes comuns — instanciamos via factory e
 * manipulamos direto: setValue(), markAsDirty(), hasError(). Nada de TestBed.
 *
 * DICA DE OURO: use as CONSTANTES reais do projeto (ORDER_FORM_CONSTANTS) nas
 * asserções em vez de números "mágicos" (30). Assim, se alguém ajustar a
 * constante, o teste continua correto sem precisar ser editado.
 * ============================================================================
 */
import { createOrderFormGroup } from './order-form.factory';
import { ORDER_FORM_CONSTANTS } from '../../../models/order-form.constants';

describe('createOrderFormGroup', () => {
  /**
   * FormGroup tem ESTADO (valores, validade, dirty...). Criar uma instância
   * nova por teste evita que a alteração feita num teste vaze para o próximo.
   * É o mesmo princípio do beforeEach, só que explícito via função auxiliar.
   */
  const buildForm = () => createOrderFormGroup();

  describe('foodName', () => {
    it('deve iniciar vazio e inválido por ser obrigatório', () => {
      const { foodName } = buildForm().controls;

      expect(foodName.value).toBe('');
      expect(foodName.hasError('required')).toBe(true);
    });

    it('deve ficar válido com qualquer texto preenchido', () => {
      const { foodName } = buildForm().controls;

      foodName.setValue('Pizza');

      expect(foodName.valid).toBe(true);
    });

    it(`deve rejeitar nome com mais de ${ORDER_FORM_CONSTANTS.MAX_LENGTH_FOOD_NAME} caracteres`, () => {
      const { foodName } = buildForm().controls;

      // 'x'.repeat(n) gera string do tamanho exato — mais legível que colar
      // 31 letras manualmente.
      foodName.setValue('x'.repeat(ORDER_FORM_CONSTANTS.MAX_LENGTH_FOOD_NAME + 1));

      expect(foodName.hasError('maxlength')).toBe(true);
    });

    it(`deve aceitar exatamente ${ORDER_FORM_CONSTANTS.MAX_LENGTH_FOOD_NAME} caracteres (limite inclusivo)`, () => {
      // Testar a FRONTEIRA exata (aceita 30, rejeita 31) pega bugs de
      // comparação "<" vs "<=" que testes genéricos deixam passar.
      const { foodName } = buildForm().controls;

      foodName.setValue('x'.repeat(ORDER_FORM_CONSTANTS.MAX_LENGTH_FOOD_NAME));

      expect(foodName.hasError('maxlength')).toBe(false);
    });
  });

  describe('price', () => {
    it('deve iniciar zerado e inválido', () => {
      // Repare: 0 é "falsy", mas o validador aqui é min(0.01) — ou seja,
      // zero NÃO é um preço válido e o form já começa inválido de propósito.
      const { price } = buildForm().controls;

      expect(price.value).toBe(0);
      expect(price.hasError('min')).toBe(true);
    });

    it(`deve aceitar preço a partir de ${ORDER_FORM_CONSTANTS.MIN_PRICE}`, () => {
      const { price } = buildForm().controls;

      price.setValue(ORDER_FORM_CONSTANTS.MIN_PRICE);

      expect(price.hasError('min')).toBe(false);
    });

    it('deve rejeitar preço abaixo do mínimo', () => {
      const { price } = buildForm().controls;

      price.setValue(0);

      expect(price.hasError('min')).toBe(true);
    });
  });

  describe('quantity', () => {
    it('deve iniciar em 1 e válido (quantidade mínima)', () => {
      const { quantity } = buildForm().controls;

      expect(quantity.value).toBe(ORDER_FORM_CONSTANTS.MIN_QUANTITY);
      expect(quantity.valid).toBe(true);
    });

    it('deve rejeitar quantidade menor que o mínimo', () => {
      const { quantity } = buildForm().controls;

      quantity.setValue(0);

      expect(quantity.hasError('min')).toBe(true);
    });
  });

  it('deve expor os três controles esperados pelo formulário', () => {
    // Teste de "contrato": garante que a estrutura do form (nomes dos campos)
    // continua compatível com quem consome getRawValue() (o OrderDraftModel).
    const form = buildForm();

    expect(Object.keys(form.controls)).toEqual(['foodName', 'price', 'quantity']);
  });
});
