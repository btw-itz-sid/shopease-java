package com.shopease.service.impl;

import com.shopease.dto.LoginRequest;
import com.shopease.dto.LoginResponse;
import com.shopease.dto.RegisterRequest;
import com.shopease.dto.UserResponse;
import com.shopease.model.User;
import com.shopease.repository.UserRepository;
import com.shopease.security.JwtUtils;
import com.shopease.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service implementation for authentication operations.
 * Handles user validation, password hashing, persistence, login, and JWT token generation.
 */
@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Autowired
    public AuthServiceImpl(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        // 1. Validate email uniqueness
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered!");
        }

        // 2. Hash plain password securely via BCrypt
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // 3. Build and persist User entity
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(hashedPassword)
                .role(request.getRole())
                .avatarUrl("https://api.dicebear.com/7.x/adventurer/svg?seed=" + request.getName().replaceAll("\\s+", ""))
                .build();

        User savedUser = userRepository.save(user);

        // 4. Map and return safe response
        return UserResponse.builder()
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .avatarUrl(savedUser.getAvatarUrl())
                .createdAt(savedUser.getCreatedAt())
                .updatedAt(savedUser.getUpdatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        // 1. Fetch user from UserRepository by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        // 2. Verify password with passwordEncoder.matches()
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // 3. Generate JWT token
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());

        // 4. Map and return LoginResponse
        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();

        return LoginResponse.builder()
                .success(true)
                .token(token)
                .user(userResponse)
                .build();
    }
}
