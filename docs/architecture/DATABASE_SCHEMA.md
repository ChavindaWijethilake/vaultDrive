# VaultDrive: Database Infrastructure

VaultDrive uses **Prisma ORM** with a **PostgreSQL** backend to ensure high-speed indexing and secure data isolation.

---

## 🏗️ Data Models

### 1. User Model
- **Purpose**: Identity management and data ownership.
- **Fields**: `id`, `email`, `password` (hashed), `createdAt`.
- **Logic**: Serves as the root for all data isolation. Every File and Folder is linked to an `ownerId`.

### 2. File Model
- **Purpose**: Metadata for encrypted resources.
- **Key Fields**:
    - `id`: Unique UUID.
    - `originalName`: User-facing filename.
    - `storageKey`: The physical path in the `/uploads` directory.
    - `mimeType`: Used for inline previews.
    - `sizeBytes`: Magnitude tracking for usage metrics.
    - `ownerId`: Foreign key to the User.
    - `folderPath`: Logical nesting path.

### 3. Folder Model
- **Purpose**: Virtual directory structure.
- **Fields**: `id`, `name`, `path`, `parentPath`, `ownerId`.
- **Logic**: Folders are virtual. Deleting a "Folder" recursively targets all files and sub-folders with matching path prefixes.

---

## 🛡️ Security & Constraints

### Data Isolation
All Prisma queries incorporate a mandatory `where: { ownerId: session.user.id }` filter. This ensures that even if a user knows a file's UUID, they cannot access it without owning it.

### Indexing
Unique indexes are applied to `(ownerId, path)` for folders to prevent naming collisions within a single user's vault while allowing different users to have folders with the same name.
