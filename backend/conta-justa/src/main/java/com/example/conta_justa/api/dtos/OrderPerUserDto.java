package com.example.conta_justa.api.dtos;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * OrderPerUserDto
 */
public record OrderPerUserDto(
  UUID userId,
  String name,
  BigDecimal totalValue,
  List<SharedFoodDto> orders
) {}
