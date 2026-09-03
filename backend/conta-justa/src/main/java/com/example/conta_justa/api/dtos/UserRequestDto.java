package com.example.conta_justa.api.dtos;

import com.example.conta_justa.domain.User;

/**
 * UserRequestDto
 */
public record UserRequestDto(String name) {
  User toEntity() {
    return new User(name());
  }
}
