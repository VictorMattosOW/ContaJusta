package com.example.conta_justa.api.exceptions;

/**
 * EmailAlreadyExistsException
 */
public class EmailAlreadyExistsException extends RuntimeException {

  public EmailAlreadyExistsException(String email) {
    super("O e-mail '" + email + "' já está cadastrado no sistema.");
  }
}
