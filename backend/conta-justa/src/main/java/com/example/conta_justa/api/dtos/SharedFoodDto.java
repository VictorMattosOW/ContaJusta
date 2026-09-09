package com.example.conta_justa.api.dtos;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * SharedFoodDto
 */
public record SharedFoodDto(
  UUID orderId,
  String food,
  BigDecimal sharedValue
) {}
