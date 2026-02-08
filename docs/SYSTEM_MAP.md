# VaultDrive: Technical System Map

This document provides a file-by-file breakdown of the VaultDrive codebase, explaining the role and core logic of each component.

---

## 📂 Root Configuration

### [globals.css](file:///e:/Projects/Web%20Application/CV/VaultDrive/vaultdrive/app/globals.css)
- **Role**: Global stylesheet and design system.
- **Logic**: Defines Tailwind CSS v4 custom theme tokens, high-end mesh gradient backgrounds, and glassmorphism effects. It also includes precision adjustments for input alignment to prevent icon overlap.

### [layout.tsx](file:///e:/Projects/Web%20Application/CV/VaultDrive/vaultdrive/app/layout.tsx)
- **Role**: Root application layout and context provider.
- **Logic**: Injects `NextAuthProvider` for session management and defines the core HTML structure with the `Inter` and `Outfit` font families.

---

## 📂 Core Logic ( /lib )

### [prisma.ts](file:///e:/Projects/Web%20Application/CV/VaultDrive/vaultdrive/lib/prisma.ts)
- **Role**: Database client instantiation.
- **Logic**: Implements a singleton pattern for the Prisma Client to prevent connection pooling issues during Next.js hot-reloading (development mode).

### [storage.ts](file:///e:/Projects/Web%20Application/CV/VaultDrive/vaultdrive/lib/storage.ts)
- **Role**: Physical storage management.
- **Logic**: Handles local filesystem operations.
    - `safeResolveLocalPath`: Prevents path traversal attacks using `path.resolve`.
    - `deleteLocalFileIfExists`: Atomic file deletion with error suppression for missing files.
    - `ensureUploadsDir`: Dynamic creation of owner-specific storage buckets.

---

## 📂 Frontend Application ( /app )

### [page.tsx](file:///e:/Projects/Web%20Application/CV/VaultDrive/vaultdrive/app/page.tsx)
- **Role**: The monolithic Dashboard and Login UI.
- **Logic**: 
    - **Authentication**: Uses `next-auth/react` to toggle between Login (unauthenticated) and Dashboard (authenticated) states.
    - **State Management**: Orchestrates folder navigation (`currentFolder`), search debouncing, and real-time upload progress.
    - **UI components**: Implements the precision Sidebar, Header with zero-overlap search, and the High-Density Data Table.

---

## 📂 Backend API ( /app/api )

### [upload/route.ts](file:///e:/Projects/Web%20Application/CV/VaultDrive/vaultdrive/app/api/upload/route.ts)
- **Role**: Secure file ingestion.
- **Logic**: Validates session, extracts `FormData`, generates unique file IDs using `crypto`, and synchronizes physical storage with the PostgreSQL/Prisma database.

### [files/route.ts](file:///e:/Projects/Web%20Application/CV/VaultDrive/vaultdrive/app/api/files/route.ts)
- **Role**: File metadata management.
- **Logic**: Implements searching (case-insensitive via Prisma), pagination, and folder-specific filtering.

### [folders/route.ts](file:///e:/Projects/Web%20Application/CV/VaultDrive/vaultdrive/app/api/folders/route.ts)
- **Role**: Directory structure management.
- **Logic**: Handles CRUD operations for folders, ensuring all operations are scoped to the `ownerId` for strict data isolation.
