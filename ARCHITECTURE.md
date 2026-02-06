# VaultDrive Architecture

VaultDrive is a production-grade, multi-user, cloud-agnostic file management system built with Next.js 14, Auth.js, Prisma, and PostgreSQL.

## Core Pillars

### 1. Security & Isolation
- **Auth.js (NextAuth v5)**: Manages secure, JWT-based sessions.
- **Strict Isolation**: Every database query and storage operation is filtered by the `ownerId` extracted from the authenticated session. There is no concept of "shared" folders in V1, ensuring data privacy by design.
- **Middleware**: Routes are protected at the edge, redirecting unauthorized traffic and ensuring API integrity.

### 2. Storage Abstraction Layer
VaultDrive uses a provider-based architecture to decouple the application logic from the underlying storage technology.
- **LocalStorage**: Efficiently manages files on the server's disk using structured paths: `storage/{ownerId}/{storedName}`.
- **S3Storage**: Interfaces with AWS S3 or MinIO. It supports **Signed URLs**, allowing clients to download files directly from the bucket securely, bypassing the application server for better scalability.

### 3. Recursive Lifecycle Management
- **Database Consistency**: Prisma handles the relational mapping of `FileObject` records.
- **Cleanup logic**: When a folder is deleted, the system recursively traverses the hierarchy to remove all associated files from the storage provider before cleaning up the database markers.

## Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS (Glassmorphism), `next-auth/react`.
- **Backend**: Next.js Route Handlers, Edge Middleware.
- **Database**: PostgreSQL with Prisma ORM.
- **Storage**: AWS SDK v3 (S3), Node.js `fs` (Local).

## Data Model
- **User**: Standard Auth.js user model.
- **FileObject**: Represents both Files and Folders.
    - `kind`: `FILE` or `FOLDER`.
    - `folderPath`: Normalized path string (e.g., `/Documents/Work`).
    - `ownerId`: Foreign key to `User`.
    - `localPath`: Unique identifier for the storage provider.
