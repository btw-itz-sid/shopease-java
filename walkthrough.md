# Day 8: Backend Login Endpoint & Frontend Auth Integration Walkthrough

This document outlines the complete set of implementations, testing steps, and integration features added for **Day 8: Backend Login Endpoint & Frontend Auth Integration**.

---

## Technical Implementations

### 1. Request/Response DTOs
- Created [LoginRequest.java](file:///c:/Users/HP/OneDrive/Desktop/shopease-starter/shopease/backend-java/src/main/java/com/shopease/dto/LoginRequest.java) to encapsulate user login credentials with validation constraints (`@NotBlank`, `@Email`).
- Created [LoginResponse.java](file:///c:/Users/HP/OneDrive/Desktop/shopease-starter/shopease/backend-java/src/main/java/com/shopease/dto/LoginResponse.java) returning a login status indicator, the generated JWT token, and the sanitized user profile.

### 2. Business Logic & Authentication Layer
- Modified [AuthService.java](file:///c:/Users/HP/OneDrive/Desktop/shopease-starter/shopease/backend-java/src/main/java/com/shopease/service/AuthService.java) to introduce the `login` method.
- Implemented `login(LoginRequest)` in [AuthServiceImpl.java](file:///c:/Users/HP/OneDrive/Desktop/shopease-starter/shopease/backend-java/src/main/java/com/shopease/service/impl/AuthServiceImpl.java):
  - Fetches the user by email from the repository (throws error if not found).
  - Performs cryptographic match validation of raw incoming password against the BCrypt hash.
  - Generates a signed JWT token containing email and role claims via `JwtUtils`.

### 3. REST Controller Endpoint
- Exposed the `POST /api/auth/login` endpoint inside [AuthController.java](file:///c:/Users/HP/OneDrive/Desktop/shopease-starter/shopease/backend-java/src/main/java/com/shopease/controller/AuthController.java).
- Handles incoming validation errors (returning `400 Bad Request`) and credential errors (returning `401 Unauthorized`).

### 4. MockMvc Unit Tests
- Added mock-based endpoint testing inside [AuthControllerTest.java](file:///c:/Users/HP/OneDrive/Desktop/shopease-starter/shopease/backend-java/src/test/java/com/shopease/controller/AuthControllerTest.java):
  - `login_Success`: Validates `200 OK` return code, token presence, and matching user properties.
  - `login_InvalidCredentials_ThrowsError`: Verifies that unauthorized password matches return a `401 Unauthorized` with the correct error envelope.
  - `login_ValidationErrors`: Confirms invalid emails/passwords return a `400 Bad Request`.

### 5. Frontend Auth Integration
- Updated [AuthModal.jsx](file:///c:/Users/HP/OneDrive/Desktop/shopease-starter/shopease/frontend/src/components/buyer/AuthModal.jsx) to store the returned token in `localStorage` under the key `shopease_token` on both successful live login/registration and sandbox login/registration modes.

---

## Verification & Test Results

### 1. Test Automation Suite (JUnit)
We ran the complete maven test suite using `mvnw.cmd test`:
- **Total Tests Run**: 12
- **Failures**: 0
- **Errors**: 0
- **Build Outcome**: SUCCESS

```bash
[INFO] Running com.shopease.controller.AuthControllerTest
...
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 2.604 s -- in com.shopease.controller.AuthControllerTest
[INFO] Running com.shopease.security.JwtUtilsTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.515 s -- in com.shopease.security.JwtUtilsTest
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 12, Failures: 0, Errors: 0, Skipped: 0
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

### 2. Manual Verification
- Attempting sign-in via `AuthModal.jsx` correctly calls the backend `/login` endpoint.
- Upon successful login, the JWT token is saved to `localStorage.shopease_token`.
- Standard error messages are shown for wrong password or unregistered email inputs.
