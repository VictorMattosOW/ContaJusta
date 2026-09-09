package com.example.conta_justa.api.dtos;

import java.math.BigDecimal;
import java.util.List;

/**
 * OrderRequestDto
 */

public record OrderRequestDto(
  String name,
  BigDecimal price,
  int quantity,
  List<UserDto> sharedUsers
) {}
