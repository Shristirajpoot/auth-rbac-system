package com.botmakers.authrbac.config;

import com.botmakers.authrbac.entity.Role;
import com.botmakers.authrbac.entity.RoleName;
import com.botmakers.authrbac.entity.User;
import com.botmakers.authrbac.repository.RoleRepository;
import com.botmakers.authrbac.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize Roles if they do not exist
        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseGet(() -> roleRepository.save(Role.builder().name(RoleName.ROLE_USER).build()));

        Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                .orElseGet(() -> roleRepository.save(Role.builder().name(RoleName.ROLE_ADMIN).build()));

        // Initialize default user
        if (!userRepository.existsByEmail("user@example.com")) {
            Set<Role> roles = new HashSet<>();
            roles.add(userRole);

            User user = User.builder()
                    .name("Regular User")
                    .email("user@example.com")
                    .password(passwordEncoder.encode("Password123"))
                    .roles(roles)
                    .build();
            userRepository.save(user);
        }

        // Initialize default admin
        if (!userRepository.existsByEmail("admin@example.com")) {
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);

            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("Password123"))
                    .roles(roles)
                    .build();
            userRepository.save(admin);
        }
    }
}
