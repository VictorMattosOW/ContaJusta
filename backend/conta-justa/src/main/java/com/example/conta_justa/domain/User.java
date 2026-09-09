package com.example.conta_justa.domain;

import java.util.UUID;

public class User {

  private UUID id;
  private String name;

  private Long appUserId;

  public User(UUID id, String name) {
    if (name == null || name.isBlank()) {
      throw new RuntimeException("Nome não pode ser vazio.");
    }
    this.id = id;
    this.name = name;
  }

  public void setAppUserId(Long appUserId) {
    this.appUserId = appUserId;
  }

  public Long getAppUserId() {
    return appUserId;
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
