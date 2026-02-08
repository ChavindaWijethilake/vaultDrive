# Database Documentation: Schema & Persistence Layer

This document details the architectural implementation of the VaultDrive persistence layer, utilizing PostgreSQL and the Prisma Object-Relational Mapper (ORM).

## 1. Database Architecture
VaultDrive employs a relational database model to ensure ACID compliance (Atomicity, Consistency, Isolation, Durability) for all file metadata and session management.

- **Engine**: PostgreSQL 15+
- **Interface**: Prisma ORM
- **Role**: State management for user identities, file structure, and replication metadata.

---

## 2. Model Specifications

### 2.1 User Model
Stores identity and core security primitives.
- `id` (String, PK): CUID-based primary identifier.
- `email` (String, Unique): Primary access key.
- `password` (String, Optional): BCrypt-hashed security protocol.
- `createdAt`/`updatedAt`: Temporal audit trails.

### 2.2 FileObject Model
The core entity for asset management.
- `id` (String, PK): Primary key.
- `kind` (Enum: FILE | FOLDER): Distinguishes between data blobs and organizational nodes.
- `folderPath` (String): Logical route for recursive traversal.
- `originalName` (String): User-defined filename.
- `storedName` (String): System-generated unique physical handle.
- `localPath` (String): Pointer to physical storage on the host filesystem.
- `sizeBytes` (Integer): Magnitude of the asset.
- `replicationStatus` (Enum: PENDING | DONE | ERROR): Real-time synchronization state.

---

## 3. Relationships & Constraints

- **User ↔ FileObject (1:N)**: A single user owns multiple file objects. Enforced via `ownerId` foreign key with `onDelete: Cascade`.
- **User ↔ Account (1:N)**: Support for multiple auth providers (NextAuth standard).

---

## 4. Interaction Flow

1.  **Orchestration**: The `app/api/upload` route initiates a `prisma.fileObject.create()` transaction.
2.  **Validation**: Prisma enforces schema-level constraints (e.g., non-null email, unique constraints).
3.  **Indexing**:
    - `@@index([ownerId, createdAt])`: Optimizes dashboard chronological listing.
    - `@@index([ownerId, folderPath])`: Optimizes directory navigation performance.

---

## 5. Persistence Protocol
The logical database acts as a **Registry**. The physical bytes are stored in the `/uploads` sector. A system directive (Purge) MUST delete both the database record and the disk asset to maintain 100% synchronization.
