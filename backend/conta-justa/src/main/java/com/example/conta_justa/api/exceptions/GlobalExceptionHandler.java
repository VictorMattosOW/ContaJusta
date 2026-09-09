package com.example.conta_justa.api.exceptions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * GlobalExceptionHandler
 */

@RestControllerAdvice
public class GlobalExceptionHandler {

  private static final Logger log = LoggerFactory.getLogger(
    GlobalExceptionHandler.class
  );

  @ExceptionHandler(IllegalArgumentException.class)
  public ProblemDetail handleIllegalArgument(IllegalArgumentException ex) {
    log.warn("Requisição inválida: {}", ex.getMessage());
    ProblemDetail problem = ProblemDetail.forStatusAndDetail(
      HttpStatus.BAD_REQUEST,
      ex.getMessage()
    );
    problem.setTitle("Requisição inválida");
    return problem;
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ProblemDetail handleBadCredentials(BadCredentialsException ex) {
    log.warn("Tentativa de login inválida");
    ProblemDetail problem = ProblemDetail.forStatusAndDetail(
      HttpStatus.UNAUTHORIZED,
      "Email ou senha inválidos"
    );
    problem.setTitle("Não autorizado");
    return problem;
  }

  @ExceptionHandler(EmailAlreadyExistsException.class)
  public ProblemDetail handleEmailAlreadyExistsException(
    EmailAlreadyExistsException ex
  ) {
    log.warn("Cadastro com email duplicado: {}", ex.getMessage());
    ProblemDetail problem = ProblemDetail.forStatusAndDetail(
      HttpStatus.CONFLICT,
      "Email já cadastrado no sistema."
    );
    problem.setTitle("Email já existe.");
    return problem;
  }
}
