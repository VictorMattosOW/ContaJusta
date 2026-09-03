package com.example.conta_justa.domain;

import java.util.List;
import java.util.UUID;

/**
 * OrderPerUser
 */
public record OrderPerUser(
  UUID userId,
  String name,
  List<SharedFood> orders,
  Money totalValue
) {}
