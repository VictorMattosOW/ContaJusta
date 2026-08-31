package com.example.conta_justa.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

/**
 * UserTest
 */
public class UserTest {

  @Test
  void deveCriarUser() {
    User user = new User("victor robaina de mattos");
    assertEquals("victor robaina de mattos", user.getName());
  }

  @Test
  void deveRejeitarComMenosDe15Caracteres() {
    String nome = "a".repeat(14);
    assertThrows(RuntimeException.class, () -> new User(nome));
  }
}
