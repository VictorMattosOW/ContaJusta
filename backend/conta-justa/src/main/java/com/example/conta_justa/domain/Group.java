package com.example.conta_justa.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * Group
 */
public class Group {

  private UUID id;
  private String name;
  private Set<User> users;
  private List<Order> orders;
  private LocalDateTime createdAt;

  public Group(String name, Set<User> users) {
    if (name == null || name.isBlank()) {
      throw new IllegalArgumentException("Nome do grupo não pode ser vazio");
    }

    if (users == null || users.size() < 2) {
      throw new IllegalArgumentException(
        "Grupo precisa ter pelo menos 2 usuários"
      );
    }

    this.id = UUID.randomUUID();
    this.name = name;
    this.users = new HashSet<>(users);
    this.orders = new ArrayList<>();
    this.createdAt = LocalDateTime.now();
  }

  public void addUser(User user) {
    this.users.add(user);
    if (this.users.size() < 2) {
      this.users.remove(user);
      throw new IllegalArgumentException(
        "Grupo precisa ter pelo menos 2 usuários"
      );
    }
  }

  public void removeUser(UUID id) {
    if (this.users.size() <= 2) {
      throw new IllegalArgumentException(
        "Grupo precisa ter pelo menos 2 usuários"
      );
    }
    this.users.removeIf(u -> u.getId().equals(id));
  }

  public void addOrder(Order order) {
    this.orders.add(order);
  }

  public void removeOrder(UUID id) {
    this.orders.removeIf(o -> o.getId().equals(id));
  }

  public UUID getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public Set<User> getUsers() {
    return users;
  }

  public List<Order> getOrders() {
    return orders;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }
}
