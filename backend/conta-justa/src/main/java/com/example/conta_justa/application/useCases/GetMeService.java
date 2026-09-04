package com.example.conta_justa.application.useCases;

import com.example.conta_justa.domain.AppUser;
import com.example.conta_justa.domain.User;
import com.example.conta_justa.infra.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class GetMeService {

  private final UserRepository userRepository;

  public GetMeService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public MeResponse execute(AppUser appUser) {
    User participant = null;
    if (appUser.getUserId() != null) {
      participant = userRepository.findById(appUser.getUserId());
    }
    return new MeResponse(
      appUser.getEmail(),
      appUser.getUserId(),
      participant != null ? participant.getName() : null
    );
  }

  public record MeResponse(String email, java.util.UUID userId, String name) {}
}
