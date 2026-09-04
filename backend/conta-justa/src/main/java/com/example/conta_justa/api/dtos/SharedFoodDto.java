package com.example.conta_justa.api.dtos;

import java.math.BigDecimal;

/**
 * SharedFoodDto
 */
public record SharedFoodDto(
  String orderId,
  String food,
  BigDecimal sharedValue
) {}
