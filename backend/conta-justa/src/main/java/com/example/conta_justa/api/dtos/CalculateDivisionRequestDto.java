package com.example.conta_justa.api.dtos;

/**
 * CalculateDivisionRequestDto
 */
import java.util.List;

public record CalculateDivisionRequestDto(
  List<UserDto> users,
  int tax,
  List<OrderRequestDto> orders
) {}
