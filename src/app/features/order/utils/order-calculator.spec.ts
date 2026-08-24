/**
 * ============================================================================
 * TESTE 1 — FUNÇÕES PURAS: o tipo de teste mais simples que existe
 * ============================================================================
 *
 * POR QUÊ testar assim?
 * Uma função "pura" é aquela que, recebendo as mesmas entradas, SEMPRE devolve
 * a mesma saída e não depende de nada externo (serviços, DOM, estado global).
 * `order-calculator.ts` é 100% isso: entra lista de pedidos/usuários, sai um
 * cálculo. Como não há dependências, NÃO precisamos do TestBed (a bancada de
 * testes do Angular que monta módulos e injeção de dependência). Basta
 * importar a função e chamar. Vantagens:
 *   - roda mais rápido (não inicializa infraestrutura nenhuma);
 *   - falha = a lógica matemática está errada, não a configuração do teste;
 *   - serve de documentação executável das regras de negócio.
 *
 * COMO ler um teste? Convenção AAA usada em todo o projeto:
 *   1. Arrange (preparar)  → monta os dados de entrada;
 *   2. Act     (agir)      → executa UMA chamada da função;
 *   3. Assert  (verificar) → expect(saida).toBe(esperado).
 *
 * PADRÃO DE NOMES dos testes (mantido em todos os specs):
 *   it('deve <comportamento esperado> quando <condição>')
 * Se lendo só o nome você entende a regra, o nome está bom.
 * ============================================================================
 */
import { applyTax, calculateConsumption, sumTotalOrders } from './order-calculator';
import { Order } from 'app/core/models/order.model';
import { User } from 'app/core/models/user.model';

// -----------------------------------------------------------------------------
// FIXTURES: objetos-exemplo reutilizáveis.
// Ficam fora de beforeEach porque funções puras nunca alteram suas entradas —
// podemos compartilhar sem risco de um teste "sujar" o outro.
// -----------------------------------------------------------------------------
const joao: User = { id: '1', name: 'João' };
const maria: User = { id: '2', name: 'Maria' };
const ana: User = { id: '3', name: 'Ana' };

const pizza: Order = {
  id: 'o1',
  name: 'Pizza',
  quantity: 1,
  price: 100,
  sharedUsers: [joao, maria]
};

describe('applyTax', () => {
  it('deve retornar o valor original quando a taxa é 0', () => {
    expect(applyTax(100, 0)).toBe(100);
  });

  it('deve aplicar 10% sobre o valor', () => {
    // 100 + (100 × 10 / 100) = 110
    expect(applyTax(100, 10)).toBe(110);
  });

  it('deve calcular taxas fracionárias sem erro de arredondamento', () => {
    // 50 + (50 × 7.5 / 100) = 53.75
    // toBeCloseTo evita falso-negativo por imprecisão binária de float
    // (0.1 + 0.2 !== 0.3 em JavaScript!). O "2" é a precisão em casas decimais.
    expect(applyTax(50, 7.5)).toBeCloseTo(53.75, 2);
  });
});

describe('sumTotalOrders', () => {
  it('deve retornar 0 quando não há pedidos', () => {
    // Caso-limite (edge case): sempre teste a "lista vazia" — é onde a maioria
    // dos bugs esconde (reduce em array vazio, divisão por zero etc.).
    expect(sumTotalOrders([], 0)).toBe(0);
  });

  it('deve somar quantidade × preço de cada pedido, sem taxa', () => {
    const suco: Order = { id: 'o2', name: 'Suco', quantity: 2, price: 30, sharedUsers: [joao] };

    const total = sumTotalOrders([pizza, suco], 0); // Act

    expect(total).toBe(160); // Pizza 1×100 + Suco 2×30
  });

  it('deve usar 0% como taxa padrão quando o parâmetro é omitido', () => {
    // A assinatura é `sumTotalOrders(orders, taxPercent = 0)`. Testar o valor
    // DEFAULT garante que mudanças futuras na assinatura não quebrem
    // silenciosamente quem já chama a função sem informar a taxa.
    expect(sumTotalOrders([pizza])).toBe(100);
  });

  it('deve aplicar a taxa percentual ao total geral', () => {
    // (1×100) com 10% = 110... mas atenção: aqui a taxa é aplicada POR PEDIDO
    // dentro do reduce. Com 1 pedido o resultado é o mesmo; o comportamento
    // por-pedido fica evidenciado no teste do serviço (múltiplos pedidos).
    expect(sumTotalOrders([pizza], 10)).toBe(110);
  });
});

describe('calculateConsumption', () => {
  it('deve retornar lista vazia quando não há pedidos OU não há usuários', () => {
    // Dois guard-clauses no início da função → dois cenários no mesmo teste
    // (são triviais e exercitam a mesma linha de código).
    expect(calculateConsumption([], [pizza], 0)).toEqual([]);
    expect(calculateConsumption([joao], [], 0)).toEqual([]);
  });

  it('deve dividir o pedido igualmente entre os usuários', () => {
    const resultado = calculateConsumption([joao, maria], [pizza], 0); // Act

    // Assert: cada usuário tem seu próprio registro (OrderPerUser)
    expect(resultado).toHaveLength(2);

    const joaoResultado = resultado.find((r) => r.name === 'João')!;
    // O "!" diz ao TypeScript "isso existe" — em teste é aceitável, pois se
    // vier undefined o expect abaixo já vai falhar com mensagem clara.

    expect(joaoResultado.totalValue).toBe(50); // 100 / 2
    expect(joaoResultado.orders[0]).toEqual({
      orderId: 'o1',
      food: 'Pizza',
      sharedValue: 50
    });
  });

  it('deve dar o resto de centavos ao último usuário (divisão inexata)', () => {
    /**
     * POR QUÊ este teste importa?
     * 100 ÷ 3 = 33.333... (dízima periódica). A implementação arredonda PARA
     * BAIXO (33,33 para cada) e soma o resto (0,01) ao ÚLTIMO usuário — assim
     * nenhum centavo se perde na conta final. Sem esse teste, alguém poderia
     * "refatorar" o arredondamento e perder R$ 0,01 silenciosamente.
     *
     * ARMADILHA de fixture: não reutilize `pizza` aqui — ela tem só João e
     * Maria no sharedUsers! Criamos um pedido DEDICADO com os três usuários,
     * pois é o sharedUsers (quem dividiu), e não a lista de usuários da mesa,
     * que define quem recebe a fatia.
     */
    const pizzaParaTres: Order = { ...pizza, sharedUsers: [joao, maria, ana] };

    const resultado = calculateConsumption([joao, maria, ana], [pizzaParaTres], 0); // Act

    const totalGeral = resultado.reduce((soma, r) => soma + r.totalValue, 0);

    expect(resultado.find((r) => r.name === 'Ana')!.totalValue).toBeCloseTo(33.34, 2);
    expect(resultado.find((r) => r.name === 'João')!.totalValue).toBeCloseTo(33.33, 2);
    // A propriedade mais importante: a conta FECHA (soma = valor original)
    expect(totalGeral).toBeCloseTo(100, 2);
  });

  it('deve acumular vários pedidos no total de cada usuário', () => {
    const suco: Order = { id: 'o2', name: 'Suco', quantity: 2, price: 15, sharedUsers: [joao] };

    const resultado = calculateConsumption([joao, maria], [pizza, suco], 0); // Act

    const joaoResultado = resultado.find((r) => r.name === 'João')!;
    // João participou dos 2 pedidos: 50 (pizza) + 30 (suco)
    expect(joaoResultado.totalValue).toBe(80);
    expect(joaoResultado.orders).toHaveLength(2);
    // Maria só participou da pizza
    expect(resultado.find((r) => r.name === 'Maria')!.totalValue).toBe(50);
  });

  it('deve aplicar a taxa antes de dividir o pedido', () => {
    // Ordem das operações: (preço × qtd) → aplica taxa → divide.
    // 100 com 10% = 110 → 110 / 2 = 55 por usuário.
    const resultado = calculateConsumption([joao, maria], [pizza], 10);

    expect(resultado.find((r) => r.name === 'João')!.totalValue).toBe(55);
  });

  it('deve lançar erro quando a taxa for negativa', () => {
    // Para testar EXCEÇÕES a chamada precisa estar DENTRO de uma função seta,
    // senão o throw acontece antes do expect conseguir capturá-la.
    // .toThrow(mensagem) verifica tanto o lançamento quanto a mensagem exata.
    expect(() => calculateConsumption([joao], [{ ...pizza, sharedUsers: [joao] }], -1)).toThrow(
      'Taxa não pode ser menor que 0'
    );
  });

  it('deve lançar erro quando o pedido não tem usuários para dividir', () => {
    const pizzaSemDonos = { ...pizza, sharedUsers: [] };

    expect(() => calculateConsumption([joao], [pizzaSemDonos], 0)).toThrow(
      'Order o1 has no shared users'
    );
  });

  it('deve lançar erro quando usuário do pedido não está na lista de usuários', () => {
    // Cenário defensivo: sharedUsers contém alguém que não veio na lista
    // principal de usuários (dado inconsistente vindo de outra tela).
    const pizzaComFantasma = { ...pizza, sharedUsers: [ana] };

    expect(() => calculateConsumption([joao], [pizzaComFantasma], 0)).toThrow(
      'User 3 not found in consumption map'
    );
  });
});
