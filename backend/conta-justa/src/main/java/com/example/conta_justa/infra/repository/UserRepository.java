package com.example.conta_justa.infra.repository;

import com.example.conta_justa.domain.User;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

/**
 * UserRepository
 */

@Repository
public class UserRepository {

  private final JdbcTemplate jdbcTemplate;

  public UserRepository(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  private final RowMapper<User> rowMapper = (rs, rowNum) -> {
    UUID id = UUID.fromString(rs.getString("id"));
    return new User(id, rs.getString("name"));
  };

  public void save(User user) {
    jdbcTemplate.update(
      "INSERT INTO person (id, name) VALUES (?, ?)",
      user.getId(),
      user.getName()
    );
  }

  public User findById(UUID id) {
    var result = jdbcTemplate.query(
      "SELECT id, name FROM person WHERE id = ?",
      rowMapper,
      id
    );
    return result.isEmpty() ? null : result.getFirst();
  }
}
