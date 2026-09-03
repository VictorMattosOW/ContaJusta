package com.example.conta_justa.application.useCases;

import com.example.conta_justa.api.dtos.RegisterRequestDto;
import com.example.conta_justa.domain.AppUser;
import com.example.conta_justa.infra.repository.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * RegisterUserService
 */

@Service
public class RegisterUserService {

  private final AppUserRepository repository;
  private final PasswordEncoder passwordEncoder;

  public RegisterUserService(
    AppUserRepository repository,
    PasswordEncoder passwordEncoder
  ) {
    this.repository = repository;
    this.passwordEncoder = passwordEncoder;
  }

  public void execute(RegisterRequestDto dto) {
    if (repository.findByEmail(dto.email()) != null) {
      throw new IllegalArgumentException("Email já cadastrado: " + dto.email());
    }
    String hash = passwordEncoder.encode(dto.password());
    repository.save(new AppUser(dto.email(), hash));
  }
}
