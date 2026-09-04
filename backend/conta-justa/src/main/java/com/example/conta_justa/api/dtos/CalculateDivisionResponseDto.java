package com.example.conta_justa.api.dtos;

import java.math.BigDecimal;
import java.util.List;

/**
 * CalculateDivisionResponseDto
 */
public record CalculateDivisionResponseDto(
  BigDecimal total,
  List<OrderPerUserDto> ordersPerUser
) {}
