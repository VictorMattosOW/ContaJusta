package com.example.conta_justa.infra.security;

import com.example.conta_justa.domain.AppUser;
import com.example.conta_justa.infra.repository.AppUserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * AppUserDetailsService
 */

@Service
public class AppUserDetailsService implements UserDetailsService {

  private final AppUserRepository repository;

  public AppUserDetailsService(AppUserRepository repository) {
    this.repository = repository;
  }

  @Override
  public UserDetails loadUserByUsername(String email)
    throws UsernameNotFoundException {
    AppUser user = repository.findByEmail(email);
    if (user == null) {
      throw new UsernameNotFoundException("Usuário não encontrado: " + email);
    }

    return user;
  }
}
