# VaultDrive V1.0.0 Release Package

This folder contains everything needed to deploy VaultDrive V1.0.0 in production.

## Contents
- `README.md` - Main project documentation
- `RELEASE_NOTES.md` - Detailed V1 release notes and features
- `docker-compose.prod.yml` - Production Docker Compose configuration
- `Dockerfile` - Multi-stage Docker build configuration
- `.env.example` - Environment variable template
- `prisma/` - Database schema and migrations

## Quick Deploy
1. Copy `.env.example` to `.env.docker` and configure your environment variables
2. Run the production stack:
   ```bash
   docker compose -f docker-compose.prod.yml down -v
   docker compose -f docker-compose.prod.yml up -d --build
   ```
3. Access at http://localhost:3001 (or your configured domain)

## What's Included in V1
- Email/Password authentication with sessions
- Multi-user file storage with isolation
- Upload, Download, Preview, Rename, Move, Delete operations
- Folder support
- Automated database migrations
- Production-ready Docker deployment

For detailed information, see `RELEASE_NOTES.md`.
