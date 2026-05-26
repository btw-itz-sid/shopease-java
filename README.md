# ShopEase — Full-Stack Multi-Vendor E-Commerce Platform

A production-ready B2C multi-product e-commerce platform built with React and Java Spring Boot.

---

## 🛠️ Technology Stack

*   **Frontend**: React 18 + Vite + Tailwind CSS + Zustand + React Query
*   **Backend**: Java 17 + Spring Boot 3.x (Spring MVC, Spring Security, Spring Data JPA)
*   **Database**: PostgreSQL (Neon DB / Local)
*   **Authentication**: JSON Web Token (JWT) + BCrypt Password Hashing
*   **Payment Gateway**: Razorpay (Java SDK Integration)
*   **Image Storage**: Cloudinary (Multi-image upload)

---


## 🚀 Quick Start

### 1. Prerequisites
*   Java Development Kit (JDK) 17 or higher
*   Node.js 18+ and npm
*   PostgreSQL Database instance

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Set VITE_API_URL=http://localhost:8080/api
npm run dev
```

### 3. Backend (Spring Boot) Setup
```bash
cd backend-java
./mvnw clean spring-boot:run
```

---

## 📂 Project Structure
```
shopease/
├── backend-java/     # Spring Boot API Application
├── backend/          # Legacy Node.js Express API (Deprecated)
├── frontend/         # React + Vite Client App
├── docs/             # Roadmap & Market Readiness Documentation
└── .github/          # CI/CD Workflows
```

