package com.shopease.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtils jwtUtils;

    @Test
    void accessSecureResource_WithoutToken_Returns403() throws Exception {
        // Accessing authenticated endpoint without token should be blocked by filter chain
        // In default Spring Boot / Spring Security 6 configurations, unauthorized accesses
        // for protected paths default to 403 Forbidden unless explicitly mapped to 401.
        mockMvc.perform(get("/api/test/secure-resource"))
                .andExpect(status().isForbidden());
    }

    @Test
    void accessSecureResource_WithValidToken_Returns200() throws Exception {
        String token = jwtUtils.generateToken("user@shopease.com", "BUYER");

        mockMvc.perform(get("/api/test/secure-resource")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void accessRoleRestrictedResource_WithIncorrectRole_Returns403() throws Exception {
        // Generating token for SELLER, but attempting to access buyer-only resource
        String token = jwtUtils.generateToken("seller@shopease.com", "SELLER");

        mockMvc.perform(get("/api/test/buyer-only")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void accessRoleRestrictedResource_WithCorrectRole_Returns200() throws Exception {
        // Generating token for BUYER, and accessing buyer-only resource
        String token = jwtUtils.generateToken("buyer@shopease.com", "BUYER");

        mockMvc.perform(get("/api/test/buyer-only")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }
}
