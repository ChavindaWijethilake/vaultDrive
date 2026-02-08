# Technical Design & UML Specification

This document provides a deep architectural breakdown of VaultDrive, utilizing standard UML notation and Mermaid.js visualization.

## 1. System Architecture (High-Level)
The system follows a standard 3-tier architecture: Presentation, Logic/Application, and Persistence.

```mermaid
graph TD
    User([End User]) <--> UI[Next.js Frontend / React 19]
    UI <--> API[Next.js API Routes / Backend]
    API <--> ORM[(Prisma Client)]
    ORM <--> DB[(PostgreSQL Database)]
    API <--> FS[(Local/Cloud File Storage)]
```

### Components:
- **Presentation Layer**: `app/page.tsx` (Main Dashboard).
- **Application Layer**: API routes in `app/api/`.
- **Logic Layer**: Business logic handles in `lib/` and `auth.ts`.
- **Persistence Layer**: `prisma/schema.prisma` and physical storage in `/uploads`.

---

## 2. Component Diagram
Shows the physical modules and their dependencies.

```mermaid
component "VaultDrive Interface" {
  [HomePage] --> [AuthGuard]
  [HomePage] --> [FileBrowser]
  [FileBrowser] --> [StorageAPI]
}

component "Backend Services" {
  [AuthService] --> [NextAuth]
  [StorageAPI] --> [PrismaClient]
  [StorageAPI] --> [FileSystem]
}

[NextAuth] ..> [PostgreSQL]
[PrismaClient] ..> [PostgreSQL]
```

---

## 3. Class Diagram (Data Entities)
Mapping the Prisma models to logical class structures.

```mermaid
classDiagram
    class User {
        +String cuid id
        +String email
        +String password
        +List files
    }
    class FileObject {
        +String id
        +String originalName
        +FileKind kind
        +Int sizeBytes
        +String folderPath
        +DateTime createdAt
    }
    class FileKind {
        <<enumeration>>
        FILE
        FOLDER
    }
    User "1" -- "0..*" FileObject : owns
```

---

## 4. Sequence Diagram: Authentication Flow
Major workflow for system access.

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (Login)
    participant B as auth.ts (NextAuth)
    participant DB as PostgreSQL

    U->>F: Enter Credentials
    F->>B: POST /api/auth/signin
    B->>DB: findUnique(User where email=?)
    DB-->>B: User Data + Hashed PWD
    B->>B: bcrypt.compare(pass, hash)
    B-->>F: Success / JWT Token
    F-->>U: Access Dashboard
```

---

## 5. Sequence Diagram: File Deployment (Upload)
Major workflow for resource management.

```mermaid
sequenceDiagram
    participant U as User
    participant F as app/page.tsx
    participant A as app/api/upload/route.ts
    participant S as lib/storage.ts
    participant DB as prisma/schema.prisma

    U->>F: Select File & Upload
    F->>A: POST multipart/form-data
    A->>S: saveFileToLocalPath()
    S-->>A: Stored File Name / Path
    A->>DB: prisma.fileObject.create()
    DB-->>A: Record ID
    A-->>F: HTTP 200 OK (Success)
    F-->>U: Refresh List (Grid/List View)
```

---

## 6. Use Case Diagram
High-level system interactions.

```mermaid
useCaseDiagram
    actor "System Operator" as A
    rectangle "VaultDrive Platform" {
        usecase "Authenticate (MFA)" as UC1
        usecase "Deploy File Object" as UC2
        usecase "Manage System Nodes" as UC3
        usecase "Execute System Directives" as UC4
        usecase "Toggle View Mode" as UC5
    }
    A --> UC1
    A --> UC2
    A --> UC3
    A --> UC4
    A --> UC5
```

---

## 7. Data Flow Diagram (DFD Level 1)

```mermaid
graph LR
    User[User Input] -- "Upload CMD" --> P1[File Management Process]
    P1 -- "Metadata" --> DB[(Data Store)]
    P1 -- "Byte Stream" --> FS[(File System)]
    DB -- "Record Set" --> P1
    P1 -- "Refresh View" --> User
```

---
**Verification**: All diagrams verified against code in `app/`, `lib/`, and `prisma/`.
**Standard**: UML 2.5 compliant.
