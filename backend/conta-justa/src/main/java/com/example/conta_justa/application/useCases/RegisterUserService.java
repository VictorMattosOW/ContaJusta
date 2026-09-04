package com.example.conta_justa.application.useCases;

import com.example.conta_justa.api.dtos.RegisterRequestDto;
import com.example.conta_justa.api.exceptions.EmailAlreadyExistsException;
import com.example.conta_justa.domain.AppUser;
import com.example.conta_justa.domain.User;
import com.example.conta_justa.infra.repository.AppUserRepository;
import com.example.conta_justa.infra.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * RegisterUserService
 */

@Service
public class RegisterUserService {

  private final AppUserRepository repository;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public RegisterUserService(
    AppUserRepository repository,
    UserRepository userRepository,
    PasswordEncoder passwordEncoder
  ) {
    this.repository = repository;
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Transactional
  public void execute(RegisterRequestDto dto) {
    if (repository.findByEmail(dto.email()) != null) {
      throw new EmailAlreadyExistsException(dto.email());
    }

    User participant = new User(dto.name());
    userRepository.save(participant);

    String hash = passwordEncoder.encode(dto.password());
    AppUser appUser = new AppUser(dto.email(), hash);
    appUser.setUserId(participant.getId());
    repository.save(appUser);
  }
}
