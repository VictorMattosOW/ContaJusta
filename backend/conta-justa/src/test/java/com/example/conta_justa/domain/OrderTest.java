package com.example.conta_justa.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class OrderTest {

  private User createUser(String name) {
    return new User(UUID.randomUUID(), name);
  }

  private Set<User> createUsers(int count) {
    Set<User> users = new java.util.HashSet<>();
    for (int i = 0; i < count; i++) {
      users.add(createUser("Usuario Teste " + i + " Nome Sobrenome"));
    }
    return users;
  }

  @Test
  void deveCriarOrder() {
    Set<User> users = createUsers(2);
    Order order = new Order(UUID.randomUUID(),"pastel de carne com queijo", users, new Money(new BigDecimal("10.00")), 1);

    assertEquals("pastel de carne com queijo", order.getFoodName());
    assertEquals(new Money(new BigDecimal("10.00")), order.getPrice());
    assertEquals(1, order.getQuantidade());
    assertEquals(users, order.getFoodShared());
  }

  @Test
  void deveAceitarQuantidadeUm() {
    Set<User> users = createUsers(2);
    Order order = new Order(UUID.randomUUID(),"pastel de carne com queijo", users, new Money(new BigDecimal("10.00")), 1);
    assertEquals(1, order.getQuantidade());
  }

  @Test
  void deveAceitarNomeComExatamente25Caracteres() {
    Set<User> users = createUsers(2);
    String nome = "a".repeat(25);
    Order order = new Order(UUID.randomUUID(),nome, users, new Money(new BigDecimal("10.00")), 1);
    assertEquals(nome, order.getFoodName());
  }

  @Test
  void deveRejeitarMenosDeDuasPessoas() {
    Set<User> users = createUsers(1);
    assertThrows(RuntimeException.class,
      () -> new Order(UUID.randomUUID(),"pastel de carne com queijo", users, new Money(new BigDecimal("10.00")), 1));
  }

  @Test
  void deveRejeitarSetVazio() {
    assertThrows(RuntimeException.class,
      () -> new Order(UUID.randomUUID(),"pastel de carne com queijo", Set.of(), new Money(new BigDecimal("10.00")), 1));
  }

  @Test
  void deveRejeitarNomeCurto() {
    Set<User> users = createUsers(2);
    assertThrows(RuntimeException.class,
      () -> new Order(UUID.randomUUID(),"pastel", users, new Money(new BigDecimal("10.00")), 1));
  }

  @Test
  void deveRejeitarQuantidadeZero() {
    Set<User> users = createUsers(2);
    assertThrows(RuntimeException.class,
      () -> new Order(UUID.randomUUID(),"pastel de carne com queijo", users, new Money(new BigDecimal("10.00")), 0));
  }

  @Test
  void deveRejeitarQuantidadeNegativa() {
    Set<User> users = createUsers(2);
    assertThrows(RuntimeException.class,
      () -> new Order(UUID.randomUUID(),"pastel de carne com queijo", users, new Money(new BigDecimal("10.00")), -1));
  }

  @Test
  void deveAceitarQuantidadeAlta() {
    Set<User> users = createUsers(2);
    Order order = new Order(UUID.randomUUID(),"pastel de carne com queijo", users, new Money(new BigDecimal("10.00")), 100);
    assertEquals(100, order.getQuantidade());
  }

  @Test
  void deveAceitarNomeMuitoLongo() {
    Set<User> users = createUsers(2);
    String nome = "a".repeat(100);
    Order order = new Order(UUID.randomUUID(),nome, users, new Money(new BigDecimal("10.00")), 1);
    assertEquals(nome, order.getFoodName());
  }

  @Test
  void deveAceitarVariosUsuarios() {
    Set<User> users = createUsers(5);
    Order order = new Order(UUID.randomUUID(),"pastel de carne com queijo", users, new Money(new BigDecimal("10.00")), 1);
    assertEquals(5, order.getFoodShared().size());
  }
}
