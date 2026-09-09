package com.example.conta_justa.domain;

import java.util.UUID;

/**
 * SharedFood
 */
public record SharedFood(UUID orderId, String food, Money sharedValue) {}
