package com.example.conta_justa.domain;

import java.util.Collection;
import java.util.List;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * UserDetails
 */
public class AppUser implements UserDetails {

  private Long id;
  private String email;
  private String password;

  public AppUser(String email, String password) {
    this.email = email;
    this.password = password;
  }

  public Long getId() {
    return id;
  }

  public String getEmail() {
    return email;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of();
  }

  @Override
  public @Nullable String getPassword() {
    return password;
  }

  @Override
  public String getUsername() {
    return email;
  }
}
