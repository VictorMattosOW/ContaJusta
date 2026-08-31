package com.example.conta_justa.infra.repository;

import com.example.conta_justa.domain.Group;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.repository.CrudRepository;

/**
 * GroupRepository
 */
public interface GroupRepository extends CrudRepository<Group, UUID> {
  Optional<Group> findById(UUID id);
}
