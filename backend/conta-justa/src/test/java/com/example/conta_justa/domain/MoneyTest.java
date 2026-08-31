package com.example.conta_justa.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;

class MoneyTest {

  @Test
  void of_converteString() {
    assertEquals(new BigDecimal("9.90"), Money.of("9.90").amount());
  }

  @Test
  void of_rejeitaNegativo() {
    assertThrows(IllegalArgumentException.class, () -> Money.of("-5"));
  }

  @Test
  void normalizaEscala() {
    assertEquals(
      new BigDecimal("1.01"),
      new Money(new BigDecimal("1.005")).amount()
    );
  }

  @Test
  void rejeitaNegativo() {
    assertThrows(IllegalArgumentException.class, () ->
      new Money(new BigDecimal("-1"))
    );
  }

  @Test
  void somaValores() {
    assertEquals(Money.of("12.50"), Money.of("5.00").add(Money.of("7.50")));
  }

  @Test
  void somaComZero() {
    assertEquals(Money.of("5.00"), Money.of("5.00").add(Money.ZERO));
  }

  @Test
  void multiplicaInteiro() {
    assertEquals(Money.of("7.50"), Money.of("2.50").multiply(3));
  }

  @Test
  void aplicaTaxa() {
    assertEquals(Money.of("110.00"), Money.of("100.00").withTax(10));
  }

  @Test
  void taxaZero() {
    assertEquals(Money.of("100.00"), Money.of("100.00").withTax(0));
  }

  @Test
  void rejeitaTaxaNegativa() {
    assertThrows(IllegalArgumentException.class, () ->
      Money.of("100.00").withTax(-1)
    );
  }

  @Test
  void divideExato() {
    assertEquals(
      List.of(Money.of("5.00"), Money.of("5.00")),
      Money.of("10.00").splitEqually(2)
    );
  }

  @Test
  void divideNaoExato() {
    assertEquals(
      List.of(Money.of("3.33"), Money.of("3.33"), Money.of("3.34")),
      Money.of("10.00").splitEqually(3)
    );
  }

  @Test
  void divideUm() {
    assertEquals(List.of(Money.of("10.00")), Money.of("10.00").splitEqually(1));
  }

  @Test
  void rejeitaZeroPartes() {
    assertThrows(IllegalArgumentException.class, () ->
      Money.of("10.00").splitEqually(0)
    );
  }
}
