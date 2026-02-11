# VaultDrive: Technical Reference Report

## 1. Technology Stack Justification
The choice of technologies for VaultDrive was driven by the need for a robust, type-safe, and scalable full-stack application that is easy to deploy and maintain.

| Technology | Rationale |
| :--- | :--- |
| **Next.js 14+** | Chosen for its unified "App Router" architecture. It allows us to handle both the user interface (Frontend) and the storage logic (Backend API) in a single, cohesive codebase with excellent performance (SSR) and edge-compatibility. |
| **Prisma ORM** | Provides a type-safe interface to the database. It automates complex SQL migrations and ensures that our data models (like `FileObject`) are consistently structure across the entire application. |
| **PostgreSQL** | An industrial-standard relational database. It was chosen for its reliability, support for ACID transactions, and powerful indexing capabilities, which are essential for managing millions of file metadata records. |
| **MinIO (S3 Compatible)** | Provides a production-grade object storage layer that is API-compatible with AWS S3. This ensures that VaultDrive can run locally for development and scale to the cloud without code changes. |
| **Next-Auth (Auth.js v5)** | The gold standard for authentication in the Next.js ecosystem. It handles session management, JWT encryption, and middleware-level protection out of the box, significantly reducing the security surface area. |

---

## 2. Core Functionality Walkthrough

### 2.1 authentication Enforcement (`lib/auth.ts`)
This module is the "Gatekeeper" of the system.

```typescript
// L7-13: Ensures that only authenticated users can access resources.
export async function requireAuth() {
  const session = await auth(); // Retrieves the session from Auth.js

  if (session?.user?.id) {
    // If a valid user ID exists, return it to the caller.
    return { ok: true, ownerId: session.user.id };
  }

  // Otherwise, return a 401 Unauthorized status.
  return { ok: false, status: 401, error: "Unauthorized" };
}
```
**Why this matters**: By centralizing authentication checks here, we ensure that every API route consistently verifies the user's identity before interacting with the database or storage.

---

### 2.2 Dynamic Folder Navigation (`app/api/folders/route.ts`)
The folder navigation logic is designed to be highly performance-oriented.

```typescript
// L49-52: Fetching direct child folders using parent path.
const folderRows = await prisma.fileObject.findMany({
    where: { ownerId, kind: "FOLDER", folderPath: parent },
    select: { originalName: true, createdAt: true, id: true, folderPath: true },
});
```
**Line Explanation**:
- **L50**: Filter by `ownerId` (Mandatory Isolation) and `kind: "FOLDER"`.
- **L50 (folderPath)**: We query by the `parent` path string. This allows for O(1) depth lookups without recursive SQL CTEs.

```typescript
// L171-185: Recursive Delete Logic
const deleteRes = await prisma.fileObject.deleteMany({
    where: {
        ownerId,
        OR: [
            { folderPath: path }, // Delete direct children
            { folderPath: { startsWith: path + "/" } }, // Delete nested children
            { kind: "FOLDER", folderPath: parentDir, originalName: folderName } // Delete self
        ]
    }
});
```
**Line Explanation**:
- **L175-176**: This `OR` condition uses a `startsWith` filter to capture the entire subtree of a folder. This is the heart of the "Recursive Delete" functionality, allowing a single SQL query to clean up an entire directory structure.

---

### 2.3 Storage Abstraction Layer (`lib/storage.ts`)
This layer decouples the application from physical file locations.

```typescript
// L15-22: Path Traversal Protection
export function safeResolveLocalPath(localPath: string) {
    const root = uploadsRootAbs();
    const abs = path.resolve(root, localPath);
    if (!abs.startsWith(root)) {
        // Blocks attackers from trying to access files outside the "uploads" directory.
        throw new Error("Invalid file path.");
    }
    return abs;
}
```
**Why this matters**: Path traversal is a critical vulnerability. This function ensures that even if a database record is compromised, the actual file system remains protected within designated boundaries.

---

## 3. Development & Lifecycle Workflows
The project uses a structured lifecycle managed via Docker and npm scripts.

1.  **Environment Setup**: `.env` files define the storage provider (LOCAL vs S3) and database credentials.
2.  **Schema Migration**: `npm run db:migrate:deploy` ensures that the PostgreSQL schema matches the latest application requirements.
3.  **Client-Side Generation**: `npx prisma generate` creates the type-safe client used in all API routes.

---

## 4. Conclusion
VaultDrive is built on the principle of **Security by Isolation**. By leveraging modern web standards and industrial-strength storage backends, it provides a reliable and professional platform for private data management.
