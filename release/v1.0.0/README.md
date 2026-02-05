# VaultDrive (V1)
A secure, self-hosted file management system with user accounts, folders, and production-ready Docker deployment.

## Key Features
- **User Authentication**: Email/Password login, sessions with HttpOnly cookies, and strict data isolation.
- **File Management**: Upload (max 25MB), Download, Preview (Image/PDF), Rename, Move, Delete.
- **Folder Support**: Nestable folders with proper navigation.
- **Production Ready**: Docker Compose setup with automated migrations and secure defaults.

## Production Deployment (Docker)

1.  **Deploy**:
    ```bash
    docker compose -f docker-compose.prod.yml down -v
    docker compose -f docker-compose.prod.yml up -d --build
    ```
    Access at `http://localhost:3001`.

2.  **Verify**:
    ```bash
    # Check migration logs to confirm DB is ready
    docker compose -f docker-compose.prod.yml logs -f migrate
    
    # Check app logs
    docker compose -f docker-compose.prod.yml logs -f app
    ```

## Development Setup
1.  **Install & Run**:
    ```bash
    npm install
    # Start DB
    docker compose up -d
    # Reset DB (Dev only)
    npx prisma migrate reset --schema=prisma/schema.prisma
    # Run App
    npm run dev
    ```
    Access at `http://localhost:3000`.

## Release Checklist (V1)

### Clean Production Boot
```bash
# Stop any dev services
# Then run full production stack
docker compose -f docker-compose.prod.yml down -v
docker compose -f docker-compose.prod.yml up -d --build

# Verify
docker compose -f docker-compose.prod.yml logs -f migrate
docker compose -f docker-compose.prod.yml logs -f app
```

### URLs to Test
- **App**: http://localhost:3001
- **Health**: http://localhost:3001/api/health

### Multi-User Isolation Test
- [ ] Register User A (`alice@example.com`)
- [ ] Upload 2 files to `/`
- [ ] Create folder `/docs`, move a file into it
- [ ] Rename a file
- [ ] Preview (if image/PDF), Download
- [ ] Delete a file (confirm removal from UI and disk)
- [ ] Logout, Login again (session persists)
- [ ] Register User B (`bob@example.com`)
- [ ] Verify: Bob sees empty drive (cannot see Alice's files)

## Release Steps

Once testing is complete, tag and push the release:
```bash
git add -A
git commit -m "Release v1.0.0: auth, sessions, multi-user storage, docker prod, migrations, docs"
git tag v1.0.0
git push origin main --tags
```

## Troubleshooting
- **Database Reset**:
  - Dev: `npx prisma migrate reset`
  - Prod: `docker compose ... down -v` (deletes volumes!)
- **"Prisma not found" in Docker**:
  - Ensure `Dockerfile` migrate stage inherits from `builder`.
  - Ensure `docker-compose.prod.yml` uses `npx prisma migrate deploy`.
- **Build Errors**:
  - Run `npm run build` locally to check for Type errors.

## Storage Security
- Uploads are stored in `./uploads/{userId}`.
- Filenames are randomized on disk to prevent collisions.
- Path traversal is blocked via `safeResolveLocalPath`.
- Deleted files are removed from disk before database record deletion.
