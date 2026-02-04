# VaultDrive

A secure, self-hosted file management system built with Next.js 16, Prisma, and PostgreSQL.

## Requirements

- Node.js (v18+)
- Docker & Docker Compose
- PostgreSQL (provided via Docker Compose)

## Setup

1. **Clone the repository** (if not already done).

2. **Environment Setup**
   Copy `.env.example` to `.env` and fill in the values.
   ```bash
   cp .env.example .env
   ```

3. **Start Database**
   ```bash
   docker compose up -d
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

6. **Run Development Server**
   ```bash
   npm run dev
   ```

   Access the app at `http://localhost:3000`.

## Authentication

VaultDrive uses a cookie-based session system.
To login, you must provide the `API_KEY` configured in your `.env` file.
This key is verified server-side and exchanges a secure `vd_session` cookie.

## Features

- **File Upload**: Secure uploads stored in `uploads/<ownerId>`.
- **Folder Management**: Create, nest, and delete folders.
- **Search**: Real-time search by filename.
- **Preview & Download**: Inline preview for Images/PDFs, secure downloads for all files.
- **Security**: 
  - Rate limiting on login and uploads.
  - Path traversal protection.
  - HttpOnly cookies.

