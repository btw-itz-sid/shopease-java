package com.shopease.controller;

import com.shopease.dto.LoginRequest;
import com.shopease.dto.LoginResponse;
import com.shopease.dto.RegisterRequest;
import com.shopease.dto.UserResponse;
import com.shopease.model.Role;
import com.shopease.service.AuthService;
import com.shopease.security.JwtUtils;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

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

    @Test
    void generateJwt_Success() throws Exception {
        String email = "test@shopease.com";
        String role = "BUYER";
        String mockToken = "header.payload.signature";

        when(jwtUtils.generateToken(email, role)).thenReturn(mockToken);

        String payload = "{" +
                "\"email\":\"test@shopease.com\"," +
                "\"role\":\"BUYER\"" +
                "}";

        mockMvc.perform(post("/auth/jwt-generate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", is(mockToken)))
                .andExpect(jsonPath("$.header", is("header")))
                .andExpect(jsonPath("$.payload", is("payload")))
                .andExpect(jsonPath("$.signature", is("signature")));
    }

    @Test
    void validateJwt_Success() throws Exception {
        String token = "valid.token.here";
        Claims mockClaims = mock(Claims.class);
        
        when(jwtUtils.validateToken(token)).thenReturn(true);
        when(jwtUtils.getClaims(token)).thenReturn(mockClaims);
        when(mockClaims.getSubject()).thenReturn("test@shopease.com");
        when(mockClaims.get("role", String.class)).thenReturn("BUYER");
        when(mockClaims.getIssuedAt()).thenReturn(new java.util.Date());
        when(mockClaims.getExpiration()).thenReturn(new java.util.Date(System.currentTimeMillis() + 60000));

        String payload = "{" +
                "\"token\":\"valid.token.here\"" +
                "}";

        mockMvc.perform(post("/auth/jwt-validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid", is(true)))
                .andExpect(jsonPath("$.claims.sub", is("test@shopease.com")))
                .andExpect(jsonPath("$.claims.role", is("BUYER")));
    }

    @Test
    void login_Success() throws Exception {
        UserResponse userResponse = UserResponse.builder()
                .id(1L)
                .name("Alice Smith")
                .email("alice@example.com")
                .role(Role.BUYER)
                .avatarUrl("https://api.dicebear.com/7.x/adventurer/svg?seed=AliceSmith")
                .createdAt(java.time.LocalDateTime.now())
                .updatedAt(java.time.LocalDateTime.now())
                .build();

        LoginResponse loginResponse = LoginResponse.builder()
                .success(true)
                .token("mock-jwt-token")
                .user(userResponse)
                .build();

        when(authService.login(any(LoginRequest.class))).thenReturn(loginResponse);

        String payload = "{" +
                "\"email\":\"alice@example.com\"," +
                "\"password\":\"password123\"" +
                "}";

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.token", is("mock-jwt-token")))
                .andExpect(jsonPath("$.user.id", is(1)))
                .andExpect(jsonPath("$.user.email", is("alice@example.com")))
                .andExpect(jsonPath("$.user.role", is("BUYER")));
    }

    @Test
    void login_InvalidCredentials_ThrowsError() throws Exception {
        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new IllegalArgumentException("Invalid email or password"));

        String payload = "{" +
                "\"email\":\"alice@example.com\"," +
                "\"password\":\"wrongpassword\"" +
                "}";

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error", is("Invalid email or password")));
    }

    @Test
    void login_ValidationErrors() throws Exception {
        // Empty fields, invalid email
        String payload = "{" +
                "\"email\":\"not-an-email\"," +
                "\"password\":\"\"" +
                "}";

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest());
    }
}
