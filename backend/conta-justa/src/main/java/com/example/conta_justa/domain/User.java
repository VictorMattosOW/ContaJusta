package com.example.conta_justa.domain;

import java.util.UUID;

public class User {

  private UUID id;
  private String name;

  public User(String name) {
    if (name.length() < 15) throw new RuntimeException(
      "Nome precisa ter pelo menos 15 caracteres."
    );

    this.id = UUID.randomUUID();
    this.name = name;
  }

  public UUID getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) return true;
    if (obj == null || getClass() != obj.getClass()) return false;
    User that = (User) obj;
    return id != null && id.equals(that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
