package com.example.conta_justa.application.useCases;

import com.example.conta_justa.api.dtos.RegisterRequestDto;
import com.example.conta_justa.api.exceptions.EmailAlreadyExistsException;
import com.example.conta_justa.application.id.IdGenerator;
import com.example.conta_justa.domain.AppUser;
import com.example.conta_justa.domain.User;
import com.example.conta_justa.infra.repository.AppUserRepository;
import com.example.conta_justa.infra.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * RegisterUserService
 */

@Service
public class RegisterUserService {

  private static final Logger log = LoggerFactory.getLogger(
    RegisterUserService.class
  );

  private final AppUserRepository repository;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final IdGenerator idGenerator;

  public RegisterUserService(
    AppUserRepository repository,
    UserRepository userRepository,
    PasswordEncoder passwordEncoder,
    IdGenerator idGenerator
  ) {
    this.repository = repository;
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.idGenerator = idGenerator;
  }

  @Transactional
  public void execute(RegisterRequestDto dto) {
    if (repository.findByEmail(dto.email()) != null) {
      log.warn("Tentativa de cadastro com email já existente: {}", dto.email());
      throw new EmailAlreadyExistsException(dto.email());
    }

    User participant = new User(idGenerator.generate(), dto.name());
    userRepository.save(participant);
    log.info("Participante criado: id={} nome={}", participant.getId(), dto.name());

    String hash = passwordEncoder.encode(dto.password());
    AppUser appUser = new AppUser(dto.email(), hash);
    appUser.setUserId(participant.getId());
    repository.save(appUser);
    log.info("Usuário autenticado criado: email={} vinculado a person={}", dto.email(), participant.getId());
  }
}
