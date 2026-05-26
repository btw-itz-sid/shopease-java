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

## 📅 15-Day Migration & Learning Roadmap

We are currently migrating the legacy Node.js Express backend to Java Spring Boot. You can track our daily progress and find interview questions in the [15-Day Roadmap](docs/15_day_github_roadmap.md).

*   **Days 1–4**: Project Setup & JPA Entity Database Modeling
*   **Days 5–8**: Spring Security & JWT Token Authentication
*   **Days 9–12**: Category APIs, Dynamic Product Searching, & Shopping Cart Services
*   **Days 13–16**: Order Transactions, Razorpay Payments, & Admin Controls

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

