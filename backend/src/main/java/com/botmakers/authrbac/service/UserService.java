package com.botmakers.authrbac.service;

import com.botmakers.authrbac.dto.RegisterRequest;
import com.botmakers.authrbac.dto.UserDto;
import com.botmakers.authrbac.entity.Role;
import com.botmakers.authrbac.entity.RoleName;
import com.botmakers.authrbac.entity.User;
import com.botmakers.authrbac.mapper.UserMapper;
import com.botmakers.authrbac.repository.RoleRepository;
import com.botmakers.authrbac.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashSet;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserMapper userMapper;

    @Transactional
    public UserDto registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email address is already in use");
        }

        // Convert role string to Enum name
        RoleName roleName;
        String requestedRole = registerRequest.getRole().toUpperCase();
        if ("ADMIN".equals(requestedRole)) {
            roleName = RoleName.ROLE_ADMIN;
        } else if ("USER".equals(requestedRole)) {
            roleName = RoleName.ROLE_USER;
        } else {
            throw new RuntimeException("Invalid role selected. Must be USER or ADMIN.");
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Error: Role " + roleName + " not found in database."));

        Set<Role> roles = new HashSet<>();
        roles.add(role);

        User user = User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .roles(roles)
                .build();

        User savedUser = userRepository.save(user);
        return userMapper.toDto(savedUser);
    }
}
