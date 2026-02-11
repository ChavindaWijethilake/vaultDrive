# VaultDrive: A Decentralized Securitas and Cloud Storage Orchestrator
## (IEEE Project Report - Formal Document)

### Abstract
This document presents the architectural specification and implementation of **VaultDrive**, a high-fidelity cloud storage orchestration system designed for enterprise-grade security and data isolation. Leveraging the Next.js framework, PostgreSQL persistence via Prisma ORM, and Multi-Factor Authentication (MFA) primitives, VaultDrive provides a robust "Digital Fortress" for sensitive asset management. The system prioritizes pixel-perfect UI/UX, real-time data replication status tracking, and scalable resource identification.

### Keywords
Cloud Storage, Next.js, Data Isolation, Prisma ORM, Enterprise Architecture, UI/UX restoration, AES-standard Security.

---

### I. Introduction
In the contemporary landscape of digital asset management, the demand for secure, isolated, and performant cloud storage solutions has reached critical levels. **VaultDrive** (v2.0) is engineered to solve the fragmentation of modern storage workflows by providing a centralized command-center for sector-based resource management.

### II. Problem Statement
Existing mid-market storage solutions often suffer from "muddy" user interfaces, poor contrast ratios, and lack of clear data isolation at the infrastructure level. Furthermore, technical documentation is frequently decoupled from actual code flow, leading to onboarding friction and security vulnerabilities.

### III. Objectives
1.  **Infrastructure Sovereignty**: Provide a self-hostable, containerized storage solution (Docker-ready).
2.  **UI/UX Restoration**: Implement enterprise-grade aesthetics with a focus on high-contrast visibility and pixel-perfect alignment.
3.  **Data Integrity**: Ensure 100% synchronization between the logical database layer and physical file storage.
4.  **Comprehensive Documentation**: Maintain an IEEE-standard academic trail of the entire system architecture.

### IV. System Overview
VaultDrive is a full-stack web application employing a "Cloud-Orchestrator" pattern. It consists of:
*   **Security Gateway**: Authenticated entry point via `next-auth`.
*   **Sector Management**: Hierarchical folder structures (System Nodes).
*   **Data Objects**: File assets with magnitude tracking (MIME-type awareness).

### V. Technology Stack
*   **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS (Vanilla CSS restoration).
*   **Backend**: Next.js API Routes (Node.js runtime).
*   **Database**: PostgreSQL via Prisma ORM.
*   **Authentication**: NextAuth.js (Credentials Provider).
*   **Deployment**: Docker & Docker-Compose (Linux/Windows compatible).

### VI. Functional Overview
*   **Resource Deployment**: Multipart file uploading with progress tracking.
*   **System Directives**: CRUD operations for files and folders (Move, Rename, Purge).
*   **Multi-View Orchestration**: Toggle between "Grid View" (Card-based) and "List View" (Table-based).
*   **Breadcrumb Navigation**: Real-time sector tracking for recursive directory traversal.

### VII. Non-Functional Requirements
1.  **Accessibility**: WCAG-compliant contrast ratios (Slate-100 on Deep Navy).
2.  **Performance**: Debounced search indexing (300ms threshold).
3.  **Scalability**: CUID-based resource identifiers for high-collision avoidance.

### VIII. Conclusion
VaultDrive v2.0 represents a significant advancement in secure personal cloud storage. By strictly separating the UI restoration layer from core business logic and maintaining an academic documentation trail, the project ensures long-term maintainability and institutional-grade reliability.

---
**Document Status**: Delivery Ready
**Confidentiality**: Professional Tier
**Version**: 2.1.0-IEEE
