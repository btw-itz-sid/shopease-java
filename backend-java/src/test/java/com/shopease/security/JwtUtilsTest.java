package com.shopease.security;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilsTest {

    private JwtUtils jwtUtils;
    private final String secret = "mock_jwt_secret_key_mock_jwt_secret_key_mock_jwt_secret_key";
    private final long expirationMs = 60000; // 1 minute

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils(secret, expirationMs);
    }

    @Test
    void testGenerateAndValidateToken() {
        String email = "test@shopease.com";
        String role = "BUYER";

        String token = jwtUtils.generateToken(email, role);
        assertNotNull(token);
        assertTrue(jwtUtils.validateToken(token));

        assertEquals(email, jwtUtils.getEmailFromToken(token));
        assertEquals(role, jwtUtils.getRoleFromToken(token));
    }

    @Test
    void testInvalidToken() {
        String invalidToken = "invalid.token.signature";
        assertFalse(jwtUtils.validateToken(invalidToken));
    }

    @Test
    void testExpiredToken() throws InterruptedException {
        String email = "expired@shopease.com";
        String role = "SELLER";
        
        // Generate token with ultra-short expiration of 1ms
        String token = jwtUtils.generateToken(email, role, 1);
        
        // Sleep to ensure it expires
        Thread.sleep(5);
        
        assertFalse(jwtUtils.validateToken(token));
    }
}
