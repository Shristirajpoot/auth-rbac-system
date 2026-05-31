package com.botmakers.authrbac.controller;

import com.botmakers.authrbac.dto.MessageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Tag(name = "Resource Controller", description = "Endpoints demonstrating Role-Based Access Control (RBAC)")
public class ContentController {

    @GetMapping("/public")
    @Operation(summary = "Get public content", description = "Accessible to all visitors without authentication")
    public ResponseEntity<MessageResponse> getPublicContent() {
        return ResponseEntity.ok(new MessageResponse("Welcome to Botmakers! This content is publicly accessible to everyone."));
    }

    @GetMapping("/user")
    @Operation(summary = "Get user-level content", description = "Accessible to authenticated users with USER or ADMIN roles")
    public ResponseEntity<MessageResponse> getUserContent() {
        return ResponseEntity.ok(new MessageResponse("Greetings! You have accessed secure user-level content successfully."));
    }

    @GetMapping("/admin")
    @Operation(summary = "Get admin-level content", description = "Strictly restricted to users with the ADMIN role")
    public ResponseEntity<MessageResponse> getAdminContent() {
        return ResponseEntity.ok(new MessageResponse("Alert: Elevated privilege verified. You have successfully accessed admin-level secure configurations."));
    }
}
