package com.botmakers.authrbac.repository;

import com.botmakers.authrbac.entity.Role;
import com.botmakers.authrbac.entity.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
