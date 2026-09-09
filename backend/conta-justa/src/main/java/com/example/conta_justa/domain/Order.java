package com.example.conta_justa.domain;

import java.util.Set;
import java.util.UUID;

public final class Order {

  private UUID id;
  private final String foodName;
  private final Money price;
  private final int quantidade;
  private final Set<User> foodShared;

  public Order(
    final UUID id,
    final String foodName,
    final Set<User> foodShared,
    final Money price,
    final int quantidade
  ) {
    if (foodShared == null || foodShared.size() < 1) throw new RuntimeException(
      "Precisa ter pelo menos 2 pessoas"
    );

    if (foodName.length() <= 0) throw new RuntimeException(
      "Nome do pedido não pode ser vazio."
    );

    if (quantidade < 1) throw new RuntimeException(
      "Quantidade tem que ser maior que 0."
    );

    this.id = id;
    this.foodShared = foodShared;
    this.foodName = foodName;
    this.price = price;
    this.quantidade = quantidade;
  }

  public UUID getId() {
    return id;
  }

  public String getFoodName() {
    return foodName;
  }

  public Money getPrice() {
    return price;
  }

  public int getQuantidade() {
    return quantidade;
  }

  public Set<User> getFoodShared() {
    return foodShared;
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) return true;
    if (obj == null || getClass() != obj.getClass()) return false;
    Order that = (Order) obj;
    return id != null && id.equals(that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
