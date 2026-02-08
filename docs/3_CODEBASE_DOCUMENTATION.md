# codebase Documentation: File-by-File Analysis

This document provides a comprehensive breakdown of the VaultDrive codebase, designed for onboarding and architectural auditing.

## 1. Core Configuration & Environment

### [.env](file:///e:/Projects/Web Application/CV/VaultDrive/vaultdrive/.env)
- **Purpose**: Defines environment-specific variables.
- **Key Variables**: `DATABASE_URL` (PostgreSQL connection), `NEXTAUTH_SECRET` (JWT signing), `UPLOAD_DIR` (Physical file storage path).
- **Security**: Critical—must never be committed to public version control.

### [package.json](file:///e:/Projects/Web Application/CV/VaultDrive/vaultdrive/package.json)
- **Purpose**: Project metadata and dependency manifest.
- **Key Dependencies**: `next`, `react`, `prisma`, `next-auth`, `bcryptjs`, `zod`.
- **Scripts**: `dev` (Local development), `build` (Production compilation), `start` (Production server).

---

## 2. Infrastructure & Persistence

### [prisma/schema.prisma](file:///e:/Projects/Web Application/CV/VaultDrive/vaultdrive/prisma/schema.prisma)
- **Purpose**: Single source of truth for the database schema.
- **Entities**:
  - `User`: Handles identity and session relations.
  - `FileObject`: Tracks logical files/folders, owner relations, and replication status.
  - `Account`/`Session`: NextAuth legacy support for identity provider persistence.

### [lib/prisma.ts](file:///e:/Projects/Web Application/CV/VaultDrive/vaultdrive/lib/prisma.ts)
- **Purpose**: Instantiates and exports the singleton `PrismaClient`.
- **Logic**: Prevents multiple client instantiations during Next.js Hot Module Replacement (HMR) to avoid database connection pool exhaustion.

---

## 3. Authentication & Security

### [auth.ts](file:///e:/Projects/Web Application/CV/VaultDrive/vaultdrive/auth.ts)
- **Purpose**: Core authentication orchestrator.
- **Logic**: Implements the `CredentialsProvider` with `zod` validation and `bcrypt` password comparison. Exports `handlers` for the API layer and `auth` helper for server-side session checks.

### [auth.config.ts](file:///e:/Projects/Web Application/CV/VaultDrive/vaultdrive/auth.config.ts)
- **Purpose**: Shared configuration for NextAuth across edge and Node runtimes.
- **Contents**: Defines callbacks and default route behavior.

---

## 4. Frontend Application Layer

### [app/page.tsx](file:///e:/Projects/Web Application/CV/VaultDrive/vaultdrive/app/page.tsx)
- **Purpose**: The "Master Dashboard" and entry point.
- **Key Logic Blocks**:
  - **State Management**: `viewMode` (List/Grid), `currentFolder` (Path tracking), `pagination`.
  - **handleAuth**: Orchestrates Login vs. Register logic.
  - **refresh**: Asynchronously fetches folders and files based on current path and search terms.
  - **uploadFile**: Handles multipart form-data submission with simulated progress feedback.
- **Interactions**: Calls API routes located in `app/api/*`.

### [app/globals.css](file:///e:/Projects/Web Application/CV/VaultDrive/vaultdrive/app/globals.css)
- **Purpose**: The design system's foundation.
- **Key Styles**: Mesh gradient backgrounds, `.glass-card` morphism, and typography normalization for high-contrast accessibility.

---

## 5. Backend API Services (Logic Controllers)

### [app/api/upload/route.ts](file:///e:/Projects/Web Application/CV/VaultDrive/vaultdrive/app/api/upload/route.ts)
- **Logic**: Parses incoming binary streams, generates unique stored names via UUID/Random primitives, and commits metadata to the `FileObject` table.

### [app/api/folders/route.ts](file:///e:/Projects/Web Application/CV/VaultDrive/vaultdrive/app/api/folders/route.ts)
- **Logic**: Handles recursive directory listing and logical directory creation.

### [lib/storage.ts](file:///e:/Projects/Web Application/CV/VaultDrive/vaultdrive/lib/storage.ts)
- **Purpose**: Physical File System Interface (Abstraction Layer).
- **Functions**: Handles writing to disk, ensuring directory existence, and purging deleted assets.

### [lib/ratelimit.ts](file:///e:/Projects/Web Application/CV/VaultDrive/vaultdrive/lib/ratelimit.ts)
- **Purpose**: Prevents brute-force and DDoS on critical endpoints (Login/Upload).
- **Mechanism**: Token-bucket or Sliding-window algorithm implementation.

---

**Onboarding Recommendation**: New developers should start by reviewing `app/page.tsx` for state flow, followed by `prisma/schema.prisma` for data modeling.
