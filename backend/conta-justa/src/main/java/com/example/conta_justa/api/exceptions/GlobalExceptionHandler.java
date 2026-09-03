package com.example.conta_justa.api.exceptions;

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

  @ExceptionHandler(IllegalArgumentException.class)
  public ProblemDetail handleIllegalArgument(IllegalArgumentException ex) {
    ProblemDetail problem = ProblemDetail.forStatusAndDetail(
      HttpStatus.BAD_REQUEST,
      ex.getMessage()
    );
    problem.setTitle("Requisição inválida");
    return problem;
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ProblemDetail handleBadCredentials(BadCredentialsException ex) {
    ProblemDetail problem = ProblemDetail.forStatusAndDetail(
      HttpStatus.UNAUTHORIZED,
      "Email ou senha inválidos"
    );
    problem.setTitle("Não autorizado");
    return problem;
  }
}
