package com.example.conta_justa.infra.repository;

import com.example.conta_justa.domain.AppUser;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

/**
 * AppUserRepository
 */

@Repository
public class AppUserRepository {

  private final JdbcTemplate jdbcTemplate;

  public AppUserRepository(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  private final RowMapper<AppUser> rowMapper = (rs, rowNum) -> {
    AppUser u = new AppUser(rs.getString("email"), rs.getString("password"));
    return u;
  };

  public AppUser findByEmail(String email) {
    var result = jdbcTemplate.query(
      "SELECT id, email, password FROM app_user WHERE email = ?",
      rowMapper,
      email
    );

    return result.isEmpty() ? null : result.getFirst();
  }

  public void save(AppUser user) {
    jdbcTemplate.update(
      "INSERT INTO app_user (email, password) VALUES (?, ?)",
      user.getEmail(),
      user.getPassword()
    );
  }
}
