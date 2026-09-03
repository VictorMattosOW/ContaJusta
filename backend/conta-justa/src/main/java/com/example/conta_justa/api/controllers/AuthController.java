package com.example.conta_justa.api.controllers;

import com.example.conta_justa.api.dtos.LoginRequestDto;
import com.example.conta_justa.api.dtos.RegisterRequestDto;
import com.example.conta_justa.application.useCases.RegisterUserService;
import com.example.conta_justa.infra.security.JwtService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * AuthController
 */

@RestController
@RequestMapping("/auth")
public class AuthController {

  private final RegisterUserService registerUserService;
  private AuthenticationManager authenticationManager;
  private final JwtService jwtService;

  public AuthController(
    RegisterUserService registerUserService,
    AuthenticationManager authenticationManager,
    JwtService jwtService
  ) {
    this.registerUserService = registerUserService;
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody RegisterRequestDto dto) {
    registerUserService.execute(dto);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequestDto dto) {
    Authentication auth = authenticationManager.authenticate(
      new UsernamePasswordAuthenticationToken(dto.email(), dto.password())
    );
    String token = jwtService.generateToken(auth.getName());
    return ResponseEntity.ok(Map.of("token", token));
  }

  @GetMapping("/me")
  public ResponseEntity<?> me(Authentication authentication) {
    return ResponseEntity.ok(Map.of("email", authentication.getName()));
  }
}
