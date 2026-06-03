package com.shopease.controller;

import com.shopease.dto.RegisterRequest;
import com.shopease.dto.UserResponse;
import com.shopease.service.AuthService;
import com.shopease.security.JwtUtils;
import io.jsonwebtoken.Claims;
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
 * Day 7: Exposes JWT token generation and validation helper endpoints.
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*") // Allows connections from local frontend
public class AuthController {

    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthService authService;
    private final JwtUtils jwtUtils;

    @Autowired
    public AuthController(BCryptPasswordEncoder passwordEncoder, AuthService authService, JwtUtils jwtUtils) {
        this.passwordEncoder = passwordEncoder;
        this.authService = authService;
        this.jwtUtils = jwtUtils;
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

    /**
     * Exposes JWT token generation utility.
     * POST /api/auth/jwt-generate
     */
    @PostMapping("/jwt-generate")
    public ResponseEntity<?> generateJwt(@RequestBody Map<String, Object> request) {
        String email = (String) request.get("email");
        String role = (String) request.get("role");
        Number customExpiry = (Number) request.get("expirationMs");

        if (email == null || email.trim().isEmpty() || role == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Email and role are required");
            return ResponseEntity.badRequest().body(error);
        }

        String token;
        if (customExpiry != null) {
            token = jwtUtils.generateToken(email, role, customExpiry.longValue());
        } else {
            token = jwtUtils.generateToken(email, role);
        }

        String[] parts = token.split("\\.");
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        if (parts.length == 3) {
            response.put("header", parts[0]);
            response.put("payload", parts[1]);
            response.put("signature", parts[2]);
        }

        return ResponseEntity.ok(response);
    }

    /**
     * Exposes JWT token validation utility.
     * POST /api/auth/jwt-validate
     */
    @PostMapping("/jwt-validate")
    public ResponseEntity<?> validateJwt(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        if (token == null || token.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Token is required");
            return ResponseEntity.badRequest().body(error);
        }

        boolean valid = jwtUtils.validateToken(token);
        Map<String, Object> response = new HashMap<>();
        response.put("valid", valid);

        if (valid) {
            Claims claims = jwtUtils.getClaims(token);
            Map<String, Object> claimsMap = new HashMap<>();
            claimsMap.put("sub", claims.getSubject());
            claimsMap.put("role", claims.get("role", String.class));
            claimsMap.put("iat", claims.getIssuedAt().getTime() / 1000);
            claimsMap.put("exp", claims.getExpiration().getTime() / 1000);
            response.put("claims", claimsMap);
        } else {
            response.put("error", "Invalid signature or token expired");
        }

        return ResponseEntity.ok(response);
    }
}
