package com.botmakers.authrbac.controller;

import com.botmakers.authrbac.dto.AuthResponse;
import com.botmakers.authrbac.dto.LoginRequest;
import com.botmakers.authrbac.dto.MessageResponse;
import com.botmakers.authrbac.dto.RegisterRequest;
import com.botmakers.authrbac.dto.UserDto;
import com.botmakers.authrbac.entity.User;
import com.botmakers.authrbac.mapper.UserMapper;
import com.botmakers.authrbac.repository.UserRepository;
import com.botmakers.authrbac.security.JwtService;
import com.botmakers.authrbac.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication Controller", description = "Endpoints for User Registration and Login")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserMapper userMapper;

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Create a new account with USER or ADMIN privileges")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            UserDto userDto = userService.registerUser(registerRequest);
            return ResponseEntity.ok(userDto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and return JWT", description = "Verifies user credentials and outputs Bearer token")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Error: Authenticated user not found in database."));

            UserDto userDto = userMapper.toDto(user);
            String token = jwtService.generateToken(user.getEmail(), userDto.getRole());

            return ResponseEntity.ok(new AuthResponse(token, "Bearer", userDto));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(new MessageResponse("Invalid email or password"));
        }
    }
}
