# VaultDrive

A secure, self-hosted file management system built with Next.js 16, Prisma, and PostgreSQL.

## Requirements

- Node.js (v18+)
- Docker & Docker Compose
- PostgreSQL (provided via Docker Compose)

## Setup

### Local Dev

1. **Start Services**
   ```bash
   docker compose up -d
   ```

2. **Install & Initialize**
   ```bash
   npm install
   npm run db:generate
   ```

3. **Run App**
   ```bash
   npm run dev
   ```

   Access at `http://localhost:3000`.

### Production Deployment

1. **Build and Run**
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```

2. **Run Migrations**
   ```bash
   docker compose -f docker-compose.prod.yml exec app npm run db:deploy
   ```

   Access at `http://localhost:3000`.

### Environment Variables
Required in your `.env` file:
- `DATABASE_URL`: Full PostgreSQL connection string
- `API_KEY`: Secret key for authentication
- `POSTGRES_USER`: Database user (default: vaultdrive)
- `POSTGRES_PASSWORD`: Database password
- `POSTGRES_DB`: Database name (default: vaultdrive_db)

## Features & Security

- **Persistent Storage**: Uploads are stored in the `vaultdrive_uploads` volume and persist across container restarts.
- **Prisma Import**: Uses consistent `@prisma/client` imports.
- **Cookie Auth**: Secure session management using `vd_session` cookie; no `API_KEY` exposure to client.
- **Path Safety**: Download routes are locked down to only serve files from within the authorized uploads directory.
- **Database**: Automatic migrations on deploy using `db:deploy`.
