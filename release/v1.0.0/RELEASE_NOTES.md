# VaultDrive V1.0.0 Release Notes

## Overview
VaultDrive V1 delivers a production-ready file manager with secure multi-user accounts, session management, and containerized deployment.

## Key Features

### Authentication & Security
- **Email/Password Login**: Secure user registration and login with `scrypt` password hashing
- **Session Management**: HttpOnly cookie sessions (`vd_session`) with 7-day expiration
- **Access Control**: All file operations enforce user ownership via `ownerId`
- **API Key Fallback**: Optional admin/legacy access via environment variable

### File Management
- **Upload**: Support for files up to 25MB with collision-safe random disk names
- **Download**: Streaming file delivery with proper Content-Disposition headers
- **Preview**: Inline preview for images, text files, and PDFs
- **Organize**: Create folders, move files, rename files
- **Delete**: Safe deletion with disk cleanup before database removal

### Storage Security
- Files stored per user: `uploads/{ownerId}/`
- Safe path resolution prevents directory traversal attacks
- Unique stored names prevent collisions: `{timestamp}-{random}.ext`

### Production Deployment
- **Containerized**: Docker Compose setup with PostgreSQL and Redis
- **Automated Migrations**: Prisma migrations run automatically on startup
- **Health Check**: `/api/health` endpoint for monitoring
- **App Dependencies**: App waits for migration completion before starting

## Production Deployment

### Quick Start
```bash
# Deploy production stack
docker compose -f docker-compose.prod.yml down -v
docker compose -f docker-compose.prod.yml up -d --build

# Verify migrations
docker compose -f docker-compose.prod.yml logs -f migrate

# Verify app startup
docker compose -f docker-compose.prod.yml logs -f app
```

Access at: **http://localhost:3001**

### Environment Variables
Copy `.env.example` to `.env.docker` and configure:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `API_KEY`: (Optional) Admin/legacy access key

## Verification Checklist

### User Accounts
- [x] Register User A (`alice@example.com`)
- [x] Logout and Login (session persists)
- [x] Register User B (`bob@example.com`)
- [x] Verify isolation: Bob cannot see Alice's files

### File Operations
- [x] Upload 2 files to `/`
- [x] Create folder `/docs`
- [x] Move file into `/docs`
- [x] Rename a file
- [x] Preview (image/PDF)
- [x] Download a file
- [x] Delete a file (confirm removal from UI and disk)

### System Health
- [x] Visit `/api/health` → Returns `{"ok": true, ...}`

## Troubleshooting

### Port Conflict
**Error**: `bind: Only one usage of each socket address`

**Solution**: Stop dev server on port 3000 or change production port in `docker-compose.prod.yml`:
```yaml
ports:
  - "3002:3000"  # Use 3002 instead
```

### Migration Logs Show "prisma: not found"
**Solution**: Ensure `Dockerfile` migrate stage inherits from `builder`:
```dockerfile
FROM builder AS migrate
```

And `docker-compose.prod.yml` uses `npx`:
```yaml
command: ["npx", "prisma", "migrate", "deploy", "--schema=prisma/schema.prisma"]
```

### Database Reset (DESTRUCTIVE)

**Development**:
```bash
npx prisma migrate reset --schema=prisma/schema.prisma
```

**Production**:
```bash
docker compose -f docker-compose.prod.yml down -v
```
⚠️ **Warning**: This deletes all volumes including database data and uploads.

### How Migrations Work

Migrations are **automated** in production via the `migrate` service in `docker-compose.prod.yml`:
```yaml
command: ["npx", "prisma", "migrate", "deploy", "--schema=prisma/schema.prisma"]
```

The app container waits for migrations to complete before starting. You do not need to run migrations manually.

## Technical Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL 16 with Prisma ORM
- **Cache**: Redis 7
- **Runtime**: Node.js 20 (Alpine)
- **Deployment**: Docker Compose

## Security Notes
- Passwords hashed with `crypto.scrypt` (Node.js built-in)
- Session tokens hashed with SHA-256 before database storage
- Cookies: `httpOnly: true`, `sameSite: 'lax'`, `secure` in production
- Rate limiting on upload endpoint (30 requests per 5 minutes)
- Path traversal protection in all file operations

## Next Steps
See `README.md` for development setup and additional documentation.
