# 📅 15+ Day GitHub Green Streak & Learning Roadmap

This plan breaks down the migration of ShopEase to a Java Spring Boot backend into **16 distinct daily tasks**. Each day requires writing a functional slice of code suitable for a daily Git commit, keeping your contribution streak active while building a strong foundation for your technical interviews.

---

## 🛠️ Phase 1: Setup & Data Modeling (Days 1–4)

### Day 1: Project Setup & Initialization
*   **Coding Work**: Download JDK 17, initialize the project structure via Spring Initializr under `shopease/backend-java`, check in the base files (POM, maven wrapper, directory structure).
*   **Git Commit**: `feat: init spring boot backend project structure`
*   **Interview Concept**: *What are Maven/Gradle? What is the Spring Boot Starter mechanism?*

### Day 2: Database Configuration & Connection
*   **Coding Work**: Configure `application.yml` or `application.properties` with database parameters (using your local PostgreSQL or Neon DB connection string) and test the startup connection.
*   **Git Commit**: `config: configure database connection parameters`
*   **Interview Concept**: *What is a Connection Pool? What is the difference between active and idle connections?*

### Day 3: Categories & Products Entities
*   **Coding Work**: Create the Java `@Entity` mappings for `Category` and `Product` models using JPA annotations (`@Id`, `@Column`, `@ManyToOne`, `@JoinColumn`).
*   **Git Commit**: `feat: implement category and product entities`
*   **Interview Concept**: *What is JPA (Java Persistence API) vs. Hibernate? What do `@Entity` and `@Table` annotations represent?*

### Day 4: User Entity & Role Enum
*   **Coding Work**: Create the `User` JPA entity and a `Role` Enum (with values `BUYER`, `SELLER`, `ADMIN`).
*   **Git Commit**: `feat: implement user entity and role enum`
*   **Interview Concept**: *How are Enums handled in database columns using `@Enumerated(EnumType.STRING)`?*

---

## 🔐 Phase 2: Authentication & Security (Days 5–8)

### Day 5: Password Hashing & Configuration
*   **Coding Work**: Create a security configuration class to define a `BCryptPasswordEncoder` bean and verify password hashing utility logic.
*   **Git Commit**: `feat: add password hashing configuration bean`
*   **Interview Concept**: *How does BCrypt work? Why do we salt passwords before hashing?*

### Day 6: User Registration API
*   **Coding Work**: Create `UserRepository`, `AuthService.register()`, and `AuthController.register()` to handle user registration requests.
*   **Git Commit**: `feat: implement user registration endpoint`
*   **Interview Concept**: *What is Dependency Injection? What is the difference between `@Autowired` on constructors vs. fields?*

### Day 7: JWT Generation & Validation Utility
*   **Coding Work**: Implement a custom `JwtUtils` class with methods to generate, parse, and validate JSON Web Tokens.
*   **Git Commit**: `feat: implement jwt utility helper class`
*   **Interview Concept**: *What are the three parts of a JWT (Header, Payload, Signature)? How is signature integrity verified?*

### Day 8: Spring Security Integration
*   **Coding Work**: Implement the custom `JwtFilter` extending `OncePerRequestFilter` and configure the `SecurityFilterChain` bean to protect backend endpoints.
*   **Git Commit**: `feat: secure endpoints using spring security filter chain`
*   **Interview Concept**: *How does the Spring Security Filter Chain intercept incoming requests?*

---

## 🛍️ Phase 3: Catalog & Cart Services (Days 9–12)

### Day 9: Category API Endpoints
*   **Coding Work**: Implement `CategoryRepository`, a service class to fetch categories, and the `CategoryController` returning JSON lists.
*   **Git Commit**: `feat: implement category list and details api`
*   **Interview Concept**: *What is the difference between `@RestController` and `@Controller`?*

### Day 10: Dynamic Product Search & Filters
*   **Coding Work**: Write a custom product repository query or use JPA Specifications to handle price range filters, search queries, and sorting.
*   **Git Commit**: `feat: add dynamic filtering to product repository`
*   **Interview Concept**: *What is the N+1 select query problem in JPA, and how do we resolve it?*

### Day 11: Product CRUD Endpoints
*   **Coding Work**: Implement APIs for creating, updating, and deleting products (with checking that only the owning seller or admin can execute updates).
*   **Git Commit**: `feat: implement product crud controller`
*   **Interview Concept**: *What are the different HTTP methods (GET, POST, PUT, DELETE, PATCH) and their idempotency?*

### Day 12: Cart Management API
*   **Coding Work**: Create the `CartItem` JPA entity, repository, and controller endpoints to add/update items in a user's persistent cart.
*   **Git Commit**: `feat: implement server side shopping cart api`
*   **Interview Concept**: *How does a Cascading delete work in database tables mapped by Hibernate?*

---

## 💳 Phase 4: Orders, Payments & Administration (Days 13–16)

### Day 13: Order Placement & Database Transactions
*   **Coding Work**: Create `Order` and `OrderItem` models. Implement the checkout logic under a `@Transactional` service annotation to ensure atomic updates to stock and cart items.
*   **Git Commit**: `feat: implement checkout service with db transactions`
*   **Interview Concept**: *What are the ACID properties of database transactions? How does Spring's `@Transactional` function?*

### Day 14: Razorpay Payment Integration
*   **Coding Work**: Recreate the payment controller endpoints. Call Razorpay API to generate transaction orders and verify webhook signatures.
*   **Git Commit**: `feat: integrate razorpay payment processing`
*   **Interview Concept**: *What are Webhooks? How does signature validation protect payment confirmation APIs?*

### Day 15: Admin Analytics & Moderation
*   **Coding Work**: Implement administration controller endpoints to pull system-wide analytics, suspend user accounts, and flag products.
*   **Git Commit**: `feat: implement admin analytics and user control api`
*   **Interview Concept**: *What is Role-Based Access Control (RBAC)? How does Spring Security evaluate method-level authorization `@PreAuthorize`?*

### Day 16: Frontend Integration & End-to-End Test
*   **Coding Work**: Configure the React app environment variables (`.env.local`) to point to the Spring Boot backend (`http://localhost:8080/api`) instead of Express. Validate end-to-end flows.
*   **Git Commit**: `config: connect react frontend to spring boot api`
*   **Interview Concept**: *What is Cross-Origin Resource Sharing (CORS)? How does browser preflight request (`OPTIONS`) work?*
