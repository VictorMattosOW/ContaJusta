package com.example.conta_justa.api.dtos;

import com.example.conta_justa.domain.User;
import java.util.UUID;

/**
 * UserRequestDto
 */
public record UserRequestDto(String name) {
  User toEntity() {
    return new User(UUID.randomUUID(), name());
  }
}
