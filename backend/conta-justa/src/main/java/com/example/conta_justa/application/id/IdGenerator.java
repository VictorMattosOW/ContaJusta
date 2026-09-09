package com.example.conta_justa.application.id;

import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class IdGenerator {

  public UUID generate() {
    return UUID.randomUUID();
  }
}