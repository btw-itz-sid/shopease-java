package com.shopease.controller;

import com.shopease.dto.RegisterRequest;
import com.shopease.dto.UserResponse;
import com.shopease.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Authentication and Security verification controller.
 * Day 5: Exposes REST API endpoints to perform password hashing.
 * Day 6: Exposes registration endpoint with input validation and uniqueness checking.
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*") // Allows connections from local frontend
public class AuthController {

    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthService authService;

    @Autowired
    public AuthController(BCryptPasswordEncoder passwordEncoder, AuthService authService) {
        this.passwordEncoder = passwordEncoder;
        this.authService = authService;
    }

    /**
     * Registers a new user with input validation.
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            UserResponse registeredUser = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    /**
     * Hashes a plain-text password using the configured BCryptPasswordEncoder.
     * POST /api/auth/hash-test
     * Body: { "password": "plainTextPassword" }
     */
    @PostMapping("/hash-test")
    public ResponseEntity<Map<String, Object>> hashPassword(@RequestBody Map<String, String> request) {
        String plainText = request.get("password");
        if (plainText == null || plainText.trim().isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Password is required");
            return ResponseEntity.badRequest().body(error);
        }

        // Generate the BCrypt hash. BCrypt generates a new random salt for each hash!
        String hashedPassword = passwordEncoder.encode(plainText);

        Map<String, Object> response = new HashMap<>();
        response.put("plainText", plainText);
        response.put("hashedPassword", hashedPassword);
        response.put("algorithm", "BCrypt");
        response.put("saltLengthBytes", 16); // BCrypt standard salt length
        response.put("status", "success");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Verifies whether a plain-text password matches a BCrypt hash.
     * POST /api/auth/verify-hash-test
     * Body: { "password": "plainTextPassword", "hashedPassword": "$2a$10$..." }
     */
    @PostMapping("/verify-hash-test")
    public ResponseEntity<Map<String, Object>> verifyHash(@RequestBody Map<String, String> request) {
        String plainText = request.get("password");
        String hashedPassword = request.get("hashedPassword");

        if (plainText == null || hashedPassword == null || hashedPassword.trim().isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Both password and hashedPassword are required");
            return ResponseEntity.badRequest().body(error);
        }

        // Verify password match cryptographically
        boolean matches = passwordEncoder.matches(plainText, hashedPassword);

        Map<String, Object> response = new HashMap<>();
        response.put("password", plainText);
        response.put("hashedPassword", hashedPassword);
        response.put("matches", matches);
        response.put("status", "success");
        
        return ResponseEntity.ok(response);
    }
}
