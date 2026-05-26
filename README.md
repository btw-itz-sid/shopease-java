# ShopEase — Full-Stack E-Commerce Platform

A production-ready B2C multi-product e-commerce platform.

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + Zustand
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (Neon DB)
- **Auth**: JWT + bcryptjs
- **Payments**: Razorpay
- **Images**: Cloudinary

## Quick Start

### 1. Clone & setup
```bash
git clone https://github.com/yourname/shopease.git
cd shopease
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your Neon DB connection string and other keys
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Project Structure
```
shopease/
├── backend/          # Node.js + Express API
├── frontend/         # React + Vite app
├── docs/             # Documentation
└── .github/          # CI/CD workflows
```
