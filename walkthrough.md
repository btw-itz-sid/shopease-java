# Day 6 User Registration & Cryptographic Security Lab Walkthrough

This document outlines the complete set of implementations, testing steps, and architectural features deployed for **Day 6: User Registration & Security visualizer integrations**.

---

## Technical Implementations

### 1. Database Schema Alignment & Table Recreation
- Dropped and re-created the PostgreSQL tables to ensure perfect mapping between the database schema and Spring Boot Entities (specifically mapping the Java `Long` primary keys to PostgreSQL `bigint` columns).
- Configured proper schema updates for Hibernate in `application.yml`.

### 2. Backend User Registration Endpoint
- **DTO validation layer**: Developed [RegisterRequest.java](file:///c:/Users/HP/OneDrive/Desktop/shopease-starter/shopease/backend-java/src/main/java/com/shopease/dto/RegisterRequest.java) featuring Jakarta validation annotations (`@NotBlank`, `@Email`, `@Size(min=6, max=40)`, `@NotNull`) to enforce credentials integrity.
- **DTO sanitized output**: Developed [UserResponse.java](file:///c:/Users/HP/OneDrive/Desktop/shopease-starter/shopease/backend-java/src/main/java/com/shopease/dto/UserResponse.java) omitting the `passwordHash` to ensure credential leakage prevention.
- **Service Layer**: Implemented [AuthService.java](file:///c:/Users/HP/OneDrive/Desktop/shopease-starter/shopease/backend-java/src/main/java/com/shopease/service/AuthService.java) and [AuthServiceImpl.java](file:///c:/Users/HP/OneDrive/Desktop/shopease-starter/shopease/backend-java/src/main/java/com/shopease/service/impl/AuthServiceImpl.java) utilizing Spring Boot's injected `BCryptPasswordEncoder` bean for dynamically salting and hashing raw credentials before persisting the User entity.
- **Controller Endpoint**: Added the `/register` mapping in [AuthController.java](file:///c:/Users/HP/OneDrive/Desktop/shopease-starter/shopease/backend-java/src/main/java/com/shopease/controller/AuthController.java) handling input validation and catching duplicate email conflicts with a clear `400 Bad Request` and descriptive error envelope.

### 3. High Performance Standalone Unit Tests
- Rewrote the integration test suite in [AuthControllerTest.java](file:///c:/Users/HP/OneDrive/Desktop/shopease-starter/shopease/backend-java/src/test/java/com/shopease/controller/AuthControllerTest.java) to run as high-performance MockMvc standalone unit tests using the standard Mockito runtime.
- Configured a local `LocalValidatorFactoryBean` dynamically inside the MockMvc initialization so that framework-level `@Valid` validations are triggered, tested, and evaluated in milliseconds, completely bypassing heavy Spring Boot context overhead.

### 4. Interactive Registration Lab
- Developed a high-fidelity **User Registration Lab** view in [SecurityVisualizer.jsx](file:///c:/Users/HP/OneDrive/Desktop/shopease-starter/shopease/frontend/src/components/buyer/SecurityVisualizer.jsx) matching the premium deep-dark aesthetic (indigo, pink, HSL gradients) of the codebase.
- **Dual Container Security Inspector**:
  - **Database Record View**: Renders direct database-level user fields. Highlights `password_hash` with a bright pink badge to visually demonstrate that the original raw password has been completely destroyed and replaced with a dynamic BCrypt salted hash.
  - **Sanitized API Response**: Renders the exact REST JSON response returned by the endpoint. Showcases that `password` fields are completely stripped, educating students on client-safe transmission layers.
- **Offline Sandbox Fallback**: Includes a robust state-syncing engine that mirrors full Spring Boot registration, email uniqueness checking, and password hashing in pure local memory if the JVM server is offline.
- **Bean Source Code Visualizer**: Updated the code tab panel to render the newly created DTO and Service files inside beautiful interactive code containers.

---

## Verification & Test Results

### 1. Backend Test Automation
We ran the JUnit Maven test suite to verify controller logic. The execution completed with **BUILD SUCCESS** and zero compilation or execution failures:

```bash
[INFO] Running com.shopease.controller.AuthControllerTest
2026-06-02T16:22:16.043+05:30  INFO 16740 --- [backend-java] [           main] o.s.mock.web.MockServletContext          : Initializing Spring TestDispatcherServlet ''
2026-06-02T16:22:16.044+05:30  INFO 16740 --- [backend-java] [           main] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-06-02T16:22:16.046+05:30  INFO 16740 --- [backend-java] [           main] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-06-02T16:22:16.669+05:30  WARN 16740 --- [backend-java] [           main] .w.s.m.s.DefaultHandlerExceptionResolver : Resolved [org.springframework.web.bind.MethodArgumentNotValidException: Validation failed for argument [0] in public org.springframework.http.ResponseEntity<?> com.shopease.controller.AuthController.register(com.shopease.dto.RegisterRequest) with 4 errors: ...
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 2.082 s -- in com.shopease.controller.AuthControllerTest
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

### 2. Manual Registration Validation
- Registering a user dynamically creates the user avatar via the DiceBear SVG API.
- Submitting an already registered email throws the correct duplicate error message.
- Input validation correctly catches blank names, invalid emails, and too short passwords.
- Side-by-side view successfully updates in real-time, displaying the encrypted credentials vs client DTO.

### 3. Storefront Frontend Registration & Auth Modal Integration
- **AuthModal Component**: Built a modern, sleek dialog with toggles for Sign In and Sign Up.
  - Interactive validation checking email pattern and minimum password length.
  - Submits registration requests directly to Spring Boot `POST http://localhost:8085/api/auth/register`.
  - Supports an automatic fallback sandbox mode to enable smooth mock signups if the backend JVM server is offline.
  - Allows selecting roles (`BUYER` vs `SELLER`) during registration.
- **Navbar Profile Dropdown**:
  - Replaced the static profile icon in the header with a dynamic button.
  - When logged in, displays the user's avatar (fetched via URL or DiceBear initials generator) and their name.
  - Clicking opens a premium dropdown menu displaying the logged-in user's details, role badge, access links, and a **Sign Out** button.
- **Session Persistence**: Saves the user's details to `localStorage` so sessions remain active across browser page reloads.

