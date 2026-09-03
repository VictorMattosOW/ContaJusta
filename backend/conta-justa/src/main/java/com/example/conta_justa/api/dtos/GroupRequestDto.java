package com.example.conta_justa.api.dtos;

import com.example.conta_justa.domain.Group;
import com.example.conta_justa.domain.User;
import java.util.Set;

/**
 * GroupRequestDto
 */
public record GroupRequestDto(String name, Set<UserRequestDto> users) {
  public Group toEntity() {
    Set<User> setUsers = Set.of();
    users().forEach(u -> setUsers.add(u.toEntity()));
    return new Group(name, setUsers);
  }
}
