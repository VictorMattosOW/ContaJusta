package com.example.conta_justa.domain;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

public record Money(BigDecimal amount) {
  public static final Money ZERO = new Money(BigDecimal.ZERO);

  public Money {
    amount = amount.setScale(2, RoundingMode.HALF_UP);
    if (amount.signum() < 0) throw new IllegalArgumentException(
      "Valor não pode ser negativo"
    );
  }

  public static Money of(String value) {
    return new Money(new BigDecimal(value));
  }

  public Money add(Money other) {
    return new Money(amount.add(other.amount));
  }

  public Money multiply(int factor) {
    return new Money(amount.multiply(BigDecimal.valueOf(factor)));
  }

  public Money withTax(int taxPercent) {
    if (taxPercent < 0) {
      throw new IllegalArgumentException("Taxa não pode ser menor que zero.");
    }
    BigDecimal factor = BigDecimal.ONE.add(
      BigDecimal.valueOf(taxPercent).divide(new BigDecimal("100"))
    );

    return new Money(amount.multiply(factor));
  }

  public List<Money> splitEqually(int parts) {
    if (parts < 1) {
      throw new IllegalArgumentException(
        "É preciso pelo menos uma pessoa para dividir"
      );
    }
    List<Money> result = new ArrayList<>(parts);
    Money part = new Money(
      amount.divide(BigDecimal.valueOf(parts), 2, RoundingMode.DOWN)
    );
    Money accumulated = Money.ZERO;

    for (int i = 0; i < parts; i++) {
      boolean isLast = i == parts - 1;
      Money share = isLast
        ? new Money(amount.subtract(accumulated.amount()))
        : part;
      accumulated = accumulated.add(share);
      result.add(share);
    }

    return result;
  }
}
