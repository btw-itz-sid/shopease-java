package com.shopease.controller;

import com.shopease.dto.RegisterRequest;
import com.shopease.dto.UserResponse;
import com.shopease.model.Role;
import com.shopease.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();
        mockMvc = MockMvcBuilders.standaloneSetup(authController)
                .setValidator(validator)
                .build();
    }

    @Test
    void register_Success() throws Exception {
        UserResponse response = UserResponse.builder()
                .id(1L)
                .name("Alice Smith")
                .email("alice@example.com")
                .role(Role.BUYER)
                .avatarUrl("https://api.dicebear.com/7.x/adventurer/svg?seed=AliceSmith")
                .createdAt(java.time.LocalDateTime.now())
                .updatedAt(java.time.LocalDateTime.now())
                .build();

        when(authService.register(any(RegisterRequest.class))).thenReturn(response);

        String payload = "{" +
                "\"name\":\"Alice Smith\"," +
                "\"email\":\"alice@example.com\"," +
                "\"password\":\"password123\"," +
                "\"role\":\"BUYER\"" +
                "}";

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Alice Smith")))
                .andExpect(jsonPath("$.email", is("alice@example.com")))
                .andExpect(jsonPath("$.role", is("BUYER")))
                .andExpect(jsonPath("$.avatarUrl", containsString("AliceSmith")));
    }

    @Test
    void register_DuplicateEmail_ThrowsError() throws Exception {
        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new IllegalArgumentException("Email is already registered!"));

        String payload = "{" +
                "\"name\":\"Alice Smith\"," +
                "\"email\":\"alice@example.com\"," +
                "\"password\":\"password123\"," +
                "\"role\":\"BUYER\"" +
                "}";

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", is("Email is already registered!")));
    }

    @Test
    void register_ValidationErrors() throws Exception {
        // Name empty, invalid email, password too short, null role
        String payload = "{" +
                "\"name\":\"\"," +
                "\"email\":\"not-an-email\"," +
                "\"password\":\"123\"," +
                "\"role\":null" +
                "}";

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest());
    }
}
