package com.example.conta_justa.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Group
 */
public class Group {

  private UUID id;
  private String name;
  private BigDecimal total;
  private List<User> users;
  private List<OrderPerUser> orders;
  private LocalDateTime createdAt;

  public Group(
    UUID id,
    String name,
    BigDecimal total,
    List<User> users,
    List<OrderPerUser> orders
  ) {
    if (name == null || name.isBlank()) {
      throw new IllegalArgumentException("Nome do grupo não pode ser vazio");
    }

    if (users == null || users.size() < 2) {
      throw new IllegalArgumentException(
        "Grupo precisa ter pelo menos 2 usuários"
      );
    }

    this.id = id;
    this.name = name;
    this.total = total;
    this.users = users;
    this.orders = orders;
    this.createdAt = LocalDateTime.now();
  }

  // public void addUser(User user) {
  //   this.users.add(user);
  //   if (this.users.size() < 2) {
  //     this.users.remove(user);
  //     throw new IllegalArgumentException(
  //       "Grupo precisa ter pelo menos 2 usuários"
  //     );
  //   }
  // }

  // public void removeUser(UUID id) {
  //   if (this.users.size() <= 2) {
  //     throw new IllegalArgumentException(
  //       "Grupo precisa ter pelo menos 2 usuários"
  //     );
  //   }
  //   this.users.removeIf(u -> u.getId().equals(id));
  // }

  public UUID getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public void setName(String name) {
    this.name = name;
  }

  public BigDecimal getTotal() {
    return total;
  }

  public void setTotal(BigDecimal total) {
    this.total = total;
  }

  public List<User> getUsers() {
    return users;
  }

  public void setUsers(List<User> users) {
    this.users = users;
  }

  public List<OrderPerUser> getOrders() {
    return orders;
  }

  public void setOrders(List<OrderPerUser> orders) {
    this.orders = orders;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }
}
