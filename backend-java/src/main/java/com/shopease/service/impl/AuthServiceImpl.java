package com.shopease.service.impl;

import com.shopease.dto.RegisterRequest;
import com.shopease.dto.UserResponse;
import com.shopease.model.User;
import com.shopease.repository.UserRepository;
import com.shopease.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service implementation for authentication operations.
 * Day 6: Handles user validation, password hashing, and user persistence.
 */
@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public AuthServiceImpl(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        // 1. Validate email uniqueness
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered!");
        }

        // 2. Hash plain password securely via Day 5 BCrypt bean
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
}
