# Architecture: Data & Persistence Layer

VaultDrive uses a robust abstraction layer to handle metadata and binary storage.

## 1. Prisma & PostgreSQL (`prisma/schema.prisma`)
The schema defines the core building blocks of the digital vault:
- **`User`**: Core identity.
- **`FileObject`**: The primary entity.
    - `kind`: Distinguishes between `FILE` and `FOLDER`.
    - `folderPath`: The virtual path (e.g., `/photos/2026`).
    - `localPath`: The physical location on disk or the cloud key.
    - `sizeBytes`: Used for calculating quota usage.

## 2. Storage Utility (`lib/storage.ts`)
This utility encapsulates the file system logic, allowing the app to be cloud-agnostic.
- **`uploadsRootAbs()`**: Resolves the base path for storage.
- **`safeResolveLocalPath()`**: Critical security function that prevents "Path Traversal" attacks (ensures files stay inside the vault).
- **`ensureUploadsDir()`**: Prepares the user's isolated directory on demand.

## 3. Integration Logic (`lib/prisma.ts`)
Ensures a singleton Prisma client instance to prevent "Too many connections" errors during development and hot-reloading.
