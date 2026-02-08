# VaultDrive: Technical Codebase Explainer

This document provides a high-level technical overview of the VaultDrive repository, explaining the directory structure and the core technology stack.

## Directory Structure

```text
vaultdrive/
├── app/                # Next.js App Router (UI & API Routes)
│   ├── api/            # Backend API Handlers
│   ├── (auth)/         # Authentication-related pages
│   ├── globals.css     # Design system and theme tokens
│   ├── layout.tsx      # Root layout and context providers
│   └── page.tsx        # Main application dashboard
├── docs/               # System documentation and manuals
├── lib/                # Shared utilities and core logic
│   ├── prisma.ts       # Database client initialization
│   ├── storage.ts      # Storage abstraction layer (Local/S3)
│   └── auth.ts         # Authentication helper functions
├── prisma/             # Database schema and migrations
├── public/             # Static assets
├── uploads/            # Local storage vault (Development)
└── package.json        # Dependencies and build scripts
```

## Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 15+ | React-based server-side framework with App Router. |
| **Styling** | Tailwind CSS v4 | Utility-first CSS for professional, responsive design. |
| **ORM** | Prisma | Type-safe database management for PostgreSQL. |
| **Database** | PostgreSQL | Relational storage for file metadata and user accounts. |
| **Auth** | NextAuth.js (v5) | Secure session management and JWT authentication. |
| **Storage** | Hybrid (Local/S3) | Abstracted storage layer using Node.js FS and AWS SDK. |

## Core Concept: Managed Isolated Storage
VaultDrive operates on a principle of **Strict Isolation**. Every file and folder is owned by a specific `ownerId`. The system ensures that:
1.  **Path Virtualization**: Users only see their own files, even if they live on the same physical disk.
2.  **Stateless API**: Every request is verified against the authenticated session.
3.  **Recursive Cleanup**: Deleting a virtual folder triggers a physical recursive deletion of all its child objects.
