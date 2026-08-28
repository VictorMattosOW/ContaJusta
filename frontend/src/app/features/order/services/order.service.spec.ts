/**
 * ============================================================================
 * TESTE 3 — SERVIÇO COM ESTADO (SIGNALS) VIA TESTBED
 * ============================================================================
 *
 * POR QUÊ o TestBed aqui, se no order-calculator.spec dispensamos?
 * O OrderService é injetável (@Injectable providedIn: 'root') e carrega ESTADO
 * interno (o signal `orders`). Usar TestBed.configureTestingModule({}) +
 * TestBed.inject() cria uma instância "do jeito que o Angular criaria",
 * garantindo que o teste exercita a mesma configuração de produção.
 *
 * ISOLAMENTO AUTOMÁTICO: entre um teste e outro o Angular reinicia o TestBed
 * (resetTestingModule). Resultado: CADA teste recebe um serviço NOVO, com o
 * signal vazio. Nunca dependa da ordem dos testes!
 *
 * SOBRE SIGNALS: signal é apenas uma função — para LER o valor, chame-a:
 *   service.orders$()   ← os parênteses no final são a leitura
 * E para escrever use os métodos do serviço; o teste nunca deve espiar o
 * estado privado, só o que é exposto publicamente (orders$ asReadonly).
 * ============================================================================
 */
import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';
import { Order } from 'app/core/models/order.model';
import { User } from 'app/core/models/user.model';

describe('OrderService', () => {
  let service: OrderService;

  const user1: User = { id: '1', name: 'João' };
  const user2: User = { id: '2', name: 'Maria' };
  const user3: User = { id: '3', name: 'Ana' };

  beforeEach(() => {
    // Sem providers = usa a configuração real do serviço (providedIn: 'root').
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ===========================================================================
  // PARTE 1 — GERENCIAMENTO DE PEDIDOS (CRUD sobre o signal interno)
  // ===========================================================================
  describe('gerenciamento de pedidos (signals)', () => {
    it('deve iniciar com a lista de pedidos vazia', () => {
      expect(service.orders$()).toEqual([]);
    });

    it('addOrder deve criar pedido completo, adicionar à lista e retorná-lo', () => {
      const dados = { foodName: 'Pizza', price: 50, quantity: 2 };

      const retorno = service.addOrder(dados, [user1]); // Act

      /**
       * O id é gerado DENTRO do serviço (crypto.randomUUID). Como não temos
       * como saber qual valor sairá, afirmamos o TIPO/FORMATO com
       * expect.any(String) em vez de fixar um valor — teste não deve ser
       * frágil a detalhes aleatórios, mas sim às regras (aqui: "tem id").
       */
      expect(retorno.id).toEqual(expect.any(String));
      expect(retorno.name).toBe('Pizza');
      expect(retorno.price).toBe(50);
      expect(retorno.quantity).toBe(2);
      expect(retorno.sharedUsers).toEqual([user1]);

      // Efeito colateral essencial: o pedido aparece na leitura pública
      expect(service.orders$()).toEqual([retorno]);
    });

    it('removeOrder deve excluir somente o pedido alvo', () => {
      const pedidoA = service.addOrder({ foodName: 'Pizza', price: 50, quantity: 1 }, [user1]);
      const pedidoB = service.addOrder({ foodName: 'Suco', price: 10, quantity: 1 }, [user1]);

      service.removeOrder(pedidoA.id); // Act

      const restantes = service.orders$();
      expect(restantes).toHaveLength(1);
      expect(restantes[0].id).toBe(pedidoB.id);
    });

    it('editOrder deve substituir o pedido de mesmo id preservando os demais', () => {
      const pedidoA = service.addOrder({ foodName: 'Pizza', price: 50, quantity: 1 }, [user1]);
      const pedidoB = service.addOrder({ foodName: 'Suco', price: 10, quantity: 1 }, [user2]);

      const versaoEditada: Order = { ...pedidoA, name: 'Calzone', price: 60 };
      service.editOrder(versaoEditada); // Act

      const lista = service.orders$();
      expect(lista).toHaveLength(2);
      expect(lista.find((o) => o.id === pedidoA.id)).toMatchObject({
        name: 'Calzone',
        price: 60,
        sharedUsers: [user1] // campos não editados vêm junto do spread
      });
      expect(lista.find((o) => o.id === pedidoB.id)?.name).toBe('Suco'); // intacto
    });

    it('clearOrder deve esvaziar toda a lista', () => {
      service.addOrder({ foodName: 'Pizza', price: 50, quantity: 1 }, [user1]);
      service.addOrder({ foodName: 'Suco', price: 10, quantity: 1 }, [user2]);

      service.clearOrder(); // Act

      expect(service.orders$()).toEqual([]);
    });
  });

  // ===========================================================================
  // PARTE 2 — DELEGAÇÃO DE CÁLCULOS
  // As regras matemáticas JÁ estão cobertas nos testes das funções puras
  // (utils/order-calculator.spec.ts). Aqui o objetivo é outro: garantir que o
  // serviço delega corretamente (assinaturas/parâmetros em ordem).
  // É o padrão "teste fino": quando a lógica vive numa função pura, o wrapper
  // só precisa provar que repassa o trabalho.
  // ===========================================================================
  describe('sumTotalOrders', () => {
    it('should return 0 for empty orders', () => {
      expect(service.sumTotalOrders([], 0)).toBe(0);
    });

    it('should return total without tax when taxPercent=0', () => {
      const orders: Order[] = [{ id: '1', name: 'Pizza', quantity: 2, price: 50, sharedUsers: [user1] }];
      expect(service.sumTotalOrders(orders, 0)).toBe(100);
    });

    it('should return total with 10% tax', () => {
      const orders: Order[] = [{ id: '1', name: 'Pizza', quantity: 1, price: 100, sharedUsers: [user1] }];
      expect(service.sumTotalOrders(orders, 10)).toBe(110);
    });

    it('should sum multiple orders', () => {
      const orders: Order[] = [
        { id: '1', name: 'Pizza', quantity: 1, price: 100, sharedUsers: [user1] },
        { id: '2', name: 'Suco', quantity: 2, price: 50, sharedUsers: [user1] }
      ];
      expect(service.sumTotalOrders(orders, 0)).toBe(200);
    });
  });

  describe('calculateConsumption', () => {
    it('should return users with zero total when no orders', () => {
      const users: User[] = [user1, user2];
      const result = service.calculateConsumption(users, [], 0);
      expect(result.length).toBe(0);
      expect(result).toEqual([]);
    });

    it('should distribute order equally between 2 users', () => {
      const users: User[] = [user1, user2];
      const orders: Order[] = [{ id: '1', name: 'Pizza', quantity: 1, price: 100, sharedUsers: [user1, user2] }];

      const result = service.calculateConsumption(users, orders, 0);

      expect(result.length).toBe(2);

      const joao = result.find((r) => r.name === 'João');
      const maria = result.find((r) => r.name === 'Maria');

      expect(joao?.totalValue).toBe(50);
      expect(maria?.totalValue).toBe(50);
      expect(joao?.orders.length).toBe(1);
      expect(joao?.orders[0].food).toBe('Pizza');
      expect(joao?.orders[0].sharedValue).toBe(50);
    });

    it('should handle remainder correctly (3 users)', () => {
      const users: User[] = [user1, user2, user3];
      const orders: Order[] = [{ id: '1', name: 'Pizza', quantity: 1, price: 100, sharedUsers: [user1, user2, user3] }];

      const result = service.calculateConsumption(users, orders, 0);

      const joao = result.find((r) => r.name === 'João');
      const maria = result.find((r) => r.name === 'Maria');
      const ana = result.find((r) => r.name === 'Ana');

      // 100 / 3 = 33.333... → equalValue = 33.33, remainder = 0.01
      expect(joao?.totalValue).toBeCloseTo(33.33, 2);
      expect(maria?.totalValue).toBeCloseTo(33.33, 2);
      // Ana gets the remainder: 33.33 + 0.01 = 33.34
      expect(ana?.totalValue).toBeCloseTo(33.34, 2);

      // Total should be exactly 100
      const total = result.reduce((sum, r) => sum + r.totalValue, 0);
      expect(total).toBeCloseTo(100, 2);
    });

    it('should apply tax to calculation', () => {
      const users: User[] = [user1, user2];
      const orders: Order[] = [{ id: '1', name: 'Pizza', quantity: 1, price: 100, sharedUsers: [user1, user2] }];

      // 100 * (1 + 10/100) = 110, divided by 2 = 55
      const result = service.calculateConsumption(users, orders, 10);

      const joao = result.find((r) => r.name === 'João');
      const maria = result.find((r) => r.name === 'Maria');

      expect(joao?.totalValue).toBe(55);
      expect(maria?.totalValue).toBe(55);
    });

    it('should handle multiple orders', () => {
      const users: User[] = [user1, user2];
      const orders: Order[] = [
        { id: '1', name: 'Pizza', quantity: 1, price: 100, sharedUsers: [user1, user2] },
        { id: '2', name: 'Suco', quantity: 2, price: 30, sharedUsers: [user1, user2] }
      ];

      const result = service.calculateConsumption(users, orders, 0);

      const joao = result.find((r) => r.name === 'João');

      // Pizza: 100 / 2 = 50
      // Suco: 60 / 2 = 30
      // Total: 80
      expect(joao?.totalValue).toBe(80);
      expect(joao?.orders.length).toBe(2);
    });

    it('should throw error when tax is negative', () => {
      const users: User[] = [user1];
      const orders: Order[] = [{ id: '1', name: 'Pizza', quantity: 1, price: 100, sharedUsers: [user1] }];

      expect(() => service.calculateConsumption(users, orders, -10)).toThrow('Taxa não pode ser menor que 0');
    });

    it('should throw error when sharedUsers is empty', () => {
      const users: User[] = [user1];
      const orders: Order[] = [{ id: '1', name: 'Pizza', quantity: 1, price: 100, sharedUsers: [] }];

      expect(() => service.calculateConsumption(users, orders, 0)).toThrow('Order 1 has no shared users');
    });

    it('should throw error when user in order is not in users list', () => {
      const users: User[] = [user1];
      const orders: Order[] = [{ id: '1', name: 'Pizza', quantity: 1, price: 100, sharedUsers: [user2] }];

      expect(() => service.calculateConsumption(users, orders, 0)).toThrow('User 2 not found in consumption map');
    });
  });
});
