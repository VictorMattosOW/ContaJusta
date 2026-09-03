package com.example.conta_justa.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;

/**
 * DivisionServiceTest
 */
public class DivisionServiceTest {

  DivisionService divisao = new DivisionService();

  private User createUser(String name) {
    return new User(name);
  }

  private Set<User> createUsers(int count) {
    Set<User> users = new HashSet<>();
    for (int i = 0; i < count; i++) {
      users.add(createUser("Usuario Teste " + i + " Nome Sobrenome"));
    }
    return users;
  }

  private Order createOrder(
    String name,
    Set<User> shared,
    BigDecimal price,
    int quantidade
  ) {
    return new Order(name, shared, new Money(price), quantidade);
  }

  private List<Order> createOrders(
    int count,
    Set<User> shared,
    BigDecimal price,
    int quantidade
  ) {
    List<Order> orders = new java.util.ArrayList<>();
    String name = "a".repeat(25);
    for (int i = 0; i < count; i++) {
      orders.add(createOrder(name + i, shared, price, quantidade));
    }
    return orders;
  }

  // Converte o Set<User> (fixture) para List<User>, que é o que calculateConsumption
  // espera. Mantém a ordem dos usuários para as asserções de índice ficarem estáveis.
  private List<User> asList(Set<User> users) {
    return new ArrayList<>(users);
  }

  @Test
  void deveCalcularConsumo() {
    var users = createUsers(2);
    var orders = createOrders(1, users, new BigDecimal(100), 1);

    // ANTES: `new ArrayList<>(users)` era redundante — a função não muta a lista.
    // Funciona, mas podemos passar `users` direto.
    List<OrderPerUser> perUser = divisao.calculateConsumption(
      asList(users),
      orders,
      1
    );

    // ANTES: assertEquals(perUser.get(0).totalValue(), new Money(...)) — ordem
    // esperado/atual invertida. Padrão JUnit: assertEquals(esperado, atual).
    // Matemática: 100 × (1 + 1/100) = 101 → /2 = 50.50 por usuário.
    assertEquals(
      new Money(new BigDecimal("50.50")),
      perUser.get(0).totalValue()
    );
    assertEquals(1, perUser.get(0).orders().size());
  }

  @Test
  void deveDividirIgualmenteSemTaxa() {
    // FALTAVA: cobrir a divisão exata sem taxa. 100 / 2 = 50/50.
    var users = createUsers(2);
    var orders = createOrders(1, users, new BigDecimal(100), 1);

    List<OrderPerUser> perUser = divisao.calculateConsumption(
      asList(users),
      orders,
      0
    );

    assertEquals(2, perUser.size());
    assertEquals(
      new Money(new BigDecimal("50.00")),
      perUser.get(0).totalValue()
    );
    assertEquals(
      new Money(new BigDecimal("50.00")),
      perUser.get(1).totalValue()
    );
  }

  @Test
  void deveDarRestoDeCentavoAoUltimo() {
    // FALTAVA: regra mais importante do DDD — o resto do centavo vai ao último.
    // 100 / 3 = 33.33 (floor), último recebe o resto: 100 - 66.66 = 33.34.
    // A soma dos três precisa fechar exatamente em 100 (nada se perde).
    var users = createUsers(3);
    var orders = createOrders(1, users, new BigDecimal(100), 1);

    List<OrderPerUser> perUser = divisao.calculateConsumption(
      asList(users),
      orders,
      0
    );

    assertEquals(
      new Money(new BigDecimal("33.33")),
      perUser.get(0).totalValue()
    );
    assertEquals(
      new Money(new BigDecimal("33.33")),
      perUser.get(1).totalValue()
    );
    assertEquals(
      new Money(new BigDecimal("33.34")),
      perUser.get(2).totalValue()
    );

    Money soma = perUser
      .get(0)
      .totalValue()
      .add(perUser.get(1).totalValue())
      .add(perUser.get(2).totalValue());
    assertEquals(new Money(new BigDecimal("100.00")), soma);
  }

  @Test
  void deveAplicarTaxaAntesDeDividir() {
    // FALTAVA: ordem das operações — aplica a taxa no total do pedido ANTES de
    // dividir entre os usuários. 100 com 10% = 110 → /2 = 55 por usuário.
    var users = createUsers(2);
    var orders = createOrders(1, users, new BigDecimal(100), 1);

    List<OrderPerUser> perUser = divisao.calculateConsumption(
      asList(users),
      orders,
      10
    );

    assertEquals(
      new Money(new BigDecimal("55.00")),
      perUser.get(0).totalValue()
    );
    assertEquals(
      new Money(new BigDecimal("55.00")),
      perUser.get(1).totalValue()
    );
  }

  @Test
  void deveAcumularMultiplosPedidos() {
    // FALTAVA: múltiplos pedidos devem somar no total de cada usuário.
    // Pedido 1: 100 / 2 = 50. Pedido 2: 40 / 2 = 20. Total por usuário = 70.
    var users = createUsers(2);
    var order1 = createOrders(1, users, new BigDecimal(100), 1);
    var order2 = createOrders(1, users, new BigDecimal(40), 1);
    List<Order> orders = new ArrayList<>();
    orders.addAll(order1);
    orders.addAll(order2);

    List<OrderPerUser> perUser = divisao.calculateConsumption(
      asList(users),
      orders,
      0
    );

    assertEquals(2, perUser.get(0).orders().size());
    assertEquals(
      new Money(new BigDecimal("70.00")),
      perUser.get(0).totalValue()
    );
  }

  @Test
  void deveReturnarErroComTaxaMenorQuel0() {
    var users = createUsers(2);
    var orders = createOrders(1, users, new BigDecimal(100), 1);

    assertThrows(IllegalArgumentException.class, () ->
      divisao.calculateConsumption(asList(users), orders, -1)
    );
  }

  @Test
  void deveReturnarArrayVazioSeArrayOrdersForVazio() {
    // ANTES (errado): chamava calculateConsumption(new ArrayList<>(), orders, -1),
    // ou seja, passava USERS vazio — e não orders vazio como o nome do teste diz.
    // O `orders` criado nem era usado. Para testar "orders vazio", quem deve ficar
    // vazio é a lista de orders, mantendo users preenchido.
    var users = createUsers(2);

    assertEquals(
      List.of(),
      divisao.calculateConsumption(asList(users), List.of(), -1)
    );
  }

  @Test
  void deveReturnarArrayVazioSeArrayUsersForVazio() {
    // ANTES (errado/invertido): passava users CHEIO e orders vazio (List.of()).
    // Isso testava "orders vazio", não "users vazio". Aqui quem deve estar vazio
    // é a lista de users, mantendo orders preenchido.
    var users = createUsers(2);
    var orders = createOrders(1, users, new BigDecimal(100), 1);

    assertEquals(
      List.of(),
      divisao.calculateConsumption(List.of(), orders, -1)
    );
  }

  // TODO: entender esse test melhor
  // @Test
  // void deveLancarErroQuandoPedidoSemSharedUsers() {
  //   // FALTAVA: pedido sem usuários compartilhados deve lançar erro, mesmo com
  //   // lista de users preenchida.
  //   var users = createUsers(2);
  //   var orders = createOrders(1, users, new BigDecimal(100), 1);

  //   assertThrows(IllegalArgumentException.class, () ->
  //     divisao.calculateConsumption(asList(users), orders, 0)
  //   );
  // }

  @Test
  void deveLancarErroQuandoUsuarioForaDaLista() {
    // FALTAVA: usuário do sharedUsers que não está na lista de users passada deve
    // lançar erro (dado inconsistente).
    var usersDaMesa = createUsers(2);
    var userForaDaLista = createUsers(2);
    var orders = createOrders(1, userForaDaLista, new BigDecimal(100), 1);

    assertThrows(IllegalArgumentException.class, () ->
      divisao.calculateConsumption(asList(usersDaMesa), orders, 0)
    );
  }

  @Test
  void deveSomarTotalOrders() {
    var users = createUsers(2);
    var orders = createOrders(1, users, new BigDecimal(100), 1);

    Money total = divisao.sumTotalOrders(orders, 1);

    // ANTES: assertEquals(total.amount(), ...) — ordem invertida. Também criava
    // new Money(101) só para comparar amount. Comparar os records Money direto.
    assertEquals(new Money(new BigDecimal("101.00")), total);
  }

  @Test
  void deveSomarTotalOrdersSemPedidos() {
    // FALTAVA: lista de pedidos vazia deve somar zero.
    assertEquals(Money.ZERO, divisao.sumTotalOrders(List.of(), 0));
  }

  @Test
  void deveSomarTotalOrdersMultiplosPedidos() {
    // FALTAVA: soma de múltiplos pedidos com taxa.
    var users = createUsers(2);
    var order1 = createOrders(1, users, new BigDecimal(100), 1);
    var order2 = createOrders(1, users, new BigDecimal(100), 1);
    List<Order> orders = new ArrayList<>();
    orders.addAll(order1);
    orders.addAll(order2);

    // (100×1×1.01) + (100×1×1.01) = 101 + 101 = 202
    assertEquals(
      new Money(new BigDecimal("202.00")),
      divisao.sumTotalOrders(orders, 1)
    );
  }
}
