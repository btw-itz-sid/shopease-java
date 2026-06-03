# ShopEase — Full-Stack Multi-Vendor E-Commerce Platform

A production-grade B2C multi-vendor e-commerce platform built with React and Java Spring Boot.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 · Vite · Tailwind CSS · Zustand · Axios · React Query |
| **Backend** | Java 17 · Spring Boot 4.x (Spring MVC, Spring Security, Spring Data JPA) |
| **Database** | PostgreSQL |
| **Authentication** | JWT (jjwt) · BCrypt Password Hashing |
| **Payment Gateway** | Razorpay (Java SDK) |
| **Image Storage** | Cloudinary |

---

## Features

- **Multi-Vendor Marketplace** — Buyers browse products from multiple verified sellers
- **JWT Authentication** — Stateless auth with role-based access control (BUYER / SELLER / ADMIN)
- **Spring Security Filter Chain** — Custom `JwtFilter` with `OncePerRequestFilter` for request interception
- **Product Catalog** — Category hierarchy, search, price filters, and sorting
- **Responsive UI** — Premium design with scroll-reveal animations, floating cards, and micro-interactions
- **Cart & Wishlist** — Client-side cart with real-time badge updates
- **SEO Optimized** — Open Graph tags, semantic HTML, proper meta descriptions

---

## Quick Start

### Prerequisites
- Java Development Kit (JDK) 17+
- Node.js 18+ and npm
- PostgreSQL database instance

### Frontend
```bash
cd frontend
npm install
# Configure API URL in .env.local
npm run dev
```

### Backend (Spring Boot)
```bash
cd backend-java
./mvnw clean spring-boot:run
```

### Environment Variables

**Frontend** (`.env.local`):
```
VITE_API_URL=http://localhost:8085
```

**Backend** (`application.properties`):
```
spring.datasource.url=jdbc:postgresql://localhost:5432/shopease
spring.datasource.username=your_username
spring.datasource.password=your_password
jwt.secret=your_jwt_secret_key
```

---

## Project Structure
```
shopease/
├── backend-java/          # Spring Boot API
│   ├── src/main/java/com/shopease/
│   │   ├── config/        # SecurityConfig
│   │   ├── controller/    # REST Controllers
│   │   ├── dto/           # Request/Response DTOs
│   │   ├── model/         # JPA Entities
│   │   ├── repository/    # Spring Data Repositories
│   │   ├── security/      # JwtFilter, JwtUtils
│   │   └── service/       # Business Logic
│   └── src/test/          # JUnit 5 Test Suite
├── frontend/              # React + Vite Client
│   ├── src/
│   │   ├── components/    # UI Components
│   │   ├── services/      # API Client (Axios + JWT interceptor)
│   │   ├── store/         # Zustand State Management
│   │   ├── styles/        # Global CSS
│   │   └── utils/         # Data & Helpers
│   └── index.html
└── docs/                  # Architecture Documentation
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Login and receive JWT | Public |

### Protected Resources
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/test/secure-resource` | Authenticated users only | Bearer Token |
| GET | `/api/test/buyer-only` | BUYER role required | Bearer Token |
| GET | `/api/test/seller-only` | SELLER role required | Bearer Token |

---

## Testing

```bash
cd backend-java
./mvnw test
```

**16 tests** covering:
- Auth controller (registration, login, validation)
- JWT utility (generation, parsing, expiration)
- Security integration (filter chain, role-based access)

---

## License

MIT
