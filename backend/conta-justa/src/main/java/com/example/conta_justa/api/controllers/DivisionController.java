package com.example.conta_justa.api.controllers;

import com.example.conta_justa.api.dtos.CalculateDivisionRequestDto;
import com.example.conta_justa.api.dtos.CalculateDivisionResponseDto;
import com.example.conta_justa.application.useCases.CalculateDivisionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * DivisionController
 */

@RestController
@RequestMapping("/division")
public class DivisionController {

  private final CalculateDivisionService calculateDivisionService;
  private static final Logger log = LoggerFactory.getLogger(
    DivisionController.class
  );

  public DivisionController(CalculateDivisionService calculateDivisionService) {
    this.calculateDivisionService = calculateDivisionService;
  }

  @PostMapping("/calculate")
  public ResponseEntity<CalculateDivisionResponseDto> calculate(
    @RequestBody CalculateDivisionRequestDto request
  ) {
    log.info("request {}", request);
    CalculateDivisionResponseDto response = calculateDivisionService.execute(
      request
    );
    return ResponseEntity.ok(response);
  }
}
