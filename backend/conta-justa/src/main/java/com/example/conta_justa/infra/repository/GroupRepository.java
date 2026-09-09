package com.example.conta_justa.infra.repository;

import com.example.conta_justa.application.id.IdGenerator;
import com.example.conta_justa.domain.Group;
import com.example.conta_justa.domain.OrderPerUser;
import com.example.conta_justa.domain.SharedFood;
import com.example.conta_justa.domain.User;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Group
 */

@Repository
public class GroupRepository {

  private final JdbcTemplate jdbcTemplate;
  private final IdGenerator idGenerator;

  public GroupRepository(JdbcTemplate jdbcTemplate, IdGenerator idGenerator) {
    this.jdbcTemplate = jdbcTemplate;
    this.idGenerator = idGenerator;
  }

  @Transactional
  public void save(Group group) {
    insertGroup(group);
    insertUsers(group);
    insertOrders(group);
  }

  private void insertGroup(Group group) {
    jdbcTemplate.update(
      "INSERT INTO groups (id, group_name, total, created_at) VALUES (?, ?, ?, ?)",
      group.getId(),
      group.getName(),
      group.getTotal(),
      group.getCreatedAt()
    );
  }

  private void insertUsers(Group group) {
    for (User user : group.getUsers()) {
      jdbcTemplate.update(
        "INSERT INTO group_user (id, group_id, name) VALUES (?, ?, ?)",
        user.getId(),
        group.getId(),
        user.getName()
      );
    }
  }

  private void insertOrders(Group group) {
    for (OrderPerUser order : group.getOrders()) {
      UUID orderPerUserId = idGenerator.generate();
      jdbcTemplate.update(
        "INSERT INTO group_order_per_user (id, group_id, user_id, name, total_value) VALUES (?, ?, ?, ?, ?)",
        orderPerUserId,
        group.getId(),
        order.userId(),
        order.name(),
        order.totalValue().amount()
      );

      for (SharedFood shared : order.orders()) {
        UUID sharedId = idGenerator.generate();
        jdbcTemplate.update(
          "INSERT INTO group_shared_food (id, order_per_user_id, order_id, food, shared_value) VALUES (?, ?, ?, ?, ?)",
          sharedId,
          orderPerUserId,
          shared.orderId(),
          shared.food(),
          shared.sharedValue().amount()
        );
      }
    }
  }
}
