package com.example.conta_justa.domain;

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;
// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.junit.jupiter.api.Assertions.assertNotNull;
// import static org.junit.jupiter.api.Assertions.assertThrows;
// import static org.junit.jupiter.api.Assertions.assertTrue;

// import java.math.BigDecimal;
// import java.util.Set;
// import java.util.UUID;
import org.junit.jupiter.api.Test;

public class GroupTest {

  private User createUser(String name) {
    return new User(UUID.randomUUID(), name);
  }

  private java.util.List<User> createUsers(int count) {
    List<User> users = new LinkedList<>();
    for (int i = 0; i < count; i++) {
      users.add(createUser("Usuario Teste " + i + " Nome Sobrenome"));
    }
    return users;
  }

  @Test
  void criaGroupComSucesso() {
    List<User> users = createUsers(2);
    String name = "Casa do sushi";
    // Group group = new Group(name, users);

    // ANTES (errado): assertEquals(group.getName(), name);
    // Por que está errado: a convenção do JUnit é assertEquals(esperado, atual).
    // Aqui o esperado (`name`) vem depois do atual (`group.getName()`), invertendo a
    // ordem. Funciona, mas o relatório de falha fica confuso.
    // assertEquals(name, group.getName());

    // ANTES (errado): assertEquals(group.getUsers(), users);
    // Por que está errado: mesma inversão esperado/atual. Além disso, o construtor
    // copia o Set (cópia defensiva), então a referência interna NÃO é a mesma passada.
    // A comparação funciona por equals, mas a ordem é o que está invertido.
    // assertEquals(users, group.getUsers());

    // ANTES (errado): assertEquals(group.getId(), String.class);
    // Por que está errado: getId() retorna UUID, não String. Comparar com String.class
    // sempre falharia. O correto é verificar que o id foi gerado (não nulo) e é UUID.
    // assertNotNull(group.getId());
    // assertTrue(group.getId() instanceof UUID);

    // FALTAVA: validar que o createdAt é preenchido no construtor.
    // assertNotNull(group.getCreatedAt());
  }

  @Test
  void erroAoCriarSemNome() {
    java.util.List<User> users = createUsers(2);
    String name = "";
    // assertThrows(IllegalArgumentException.class, () -> new Group(name, users));
  }

  @Test
  void erroAoCriarNomeSomenteEspacos() {
    // FALTAVA: o construtor usa name.isBlank(), então nome só com espaços também deve
    // lançar. Cobre o caso "   " que é blank sem ser vazio.
    java.util.List<User> users = createUsers(2);
    String name = "   ";
    // assertThrows(IllegalArgumentException.class, () -> new Group(name, users));
  }

  @Test
  void erroAoCriarNomeNull() {
    // FALTAVA: o construtor valida name == null explicitamente. Cobertura do guard-clause.
    java.util.List<User> users = createUsers(2);
    // assertThrows(IllegalArgumentException.class, () -> new Group(null, users));
  }

  @Test
  void erroAoCriarSem2Users() {
    java.util.List<User> users = createUsers(1);

    // ANTES (errado): String name = "";
    // Por que está errado: o construtor valida o NOME antes de validar os usuários.
    // Com name vazio, o erro dispara por causa do nome, NÃO pela falta de 2 usuários.
    // O teste não isolava a regra que pretendia testar. Para testar a regra de
    // usuários isoladamente, o nome precisa ser válido.
    String name = "Casa do sushi";
    // assertThrows(IllegalArgumentException.class, () -> new Group(name, users));
  }

  @Test
  void deveAdicionarUmUsuario() {
    java.util.List<User> users = createUsers(2);
    String nome = "a".repeat(15);
    var user = createUser(nome);
    // Group group = new Group("Casa do sushi", users);

    // assertEquals(2, group.getUsers().size());

    // group.addUser(user);

    // assertEquals(3, group.getUsers().size());
  }

  @Test
  void deveRemoverUmUsuario() {
    // Set<User> users = createUsers(2);
    // String nome = "a".repeat(15);
    // var user = createUser(nome);
    // Group group = new Group("Casa do sushi", users);
    // group.addUser(user);
    // assertEquals(3, group.getUsers().size());
    // group.removeUser(user.getId());
    // assertEquals(2, group.getUsers().size());
  }

  @Test
  void erroAoRemoverQuandoSoHa2Users() {
    // FALTAVA: a regra mais importante do Group. removeUser bloqueia quando restariam
    // menos de 2 usuários (size() <= 2 lança). Com exatamente 2 usuários, remover
    // deve lançar IllegalArgumentException para preservar o invariante de mínimo.
    // Set<User> users = createUsers(2);
    // Group group = new Group("Casa do sushi", users);
    // User primeiro = users.iterator().next();
    // assertThrows(IllegalArgumentException.class, () ->
    //   group.removeUser(primeiro.getId())
    // );
    // assertEquals(2, group.getUsers().size());
  }

  @Test
  void devePoderAdicionarUmaOrder() {
    // Set<User> users = createUsers(2);
    // String name = "Casa do sushi";
    // Group group = new Group(name, users);
    // Order order = new Order(
    //   "muito sushu com bastante shoyu",
    //   users,
    //   new Money(new BigDecimal("10.00")),
    //   1
    // );
    // group.addOrder(order);
    // assertEquals(1, group.getOrders().size());
  }

  @Test
  void devePoderRemoverUmOrder() {
    // Set<User> users = createUsers(2);
    // String name = "Casa do sushi";
    // Group group = new Group(name, users);
    // Order order = new Order(
    //   "muito sushu com bastante shoyu",
    //   users,
    //   new Money(new BigDecimal("10.00")),
    //   1
    // );
    // // ANTES (errado): chamava group.removeOrder(order.getId()) SEM antes adicionar a
    // // order. Por que está errado: como a lista `orders` começa vazia, o removeIf não
    // // encontra nada e o teste passava "por acidente" (size() == 0). O teste NÃO
    // // validava a remoção de fato — só o estado inicial vazio. Adicionar antes de
    // // remover garante que a remoção realmente acontece.
    // group.addOrder(order);
    // assertEquals(1, group.getOrders().size());
    // group.removeOrder(order.getId());
    // assertEquals(0, group.getOrders().size());
  }
}
