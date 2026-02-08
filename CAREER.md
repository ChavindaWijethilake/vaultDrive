# VaultDrive Career Handbook 💼

This document is designed to help you leverage VaultDrive in your professional career. Use these materials for your resume, LinkedIn, and software engineering interviews.

## 📝 Resume Bullets

**Option 1: Focused on Security & Multi-Tenancy (Strong for Backend/DevOps roles)**
- Built a secure, multi-tenant file management system from scratch using **Next.js 14**, **Prisma**, and **Auth.js**, ensuring strictly isolated data environments for concurrent users via a custom `requireAuth` middleware pattern.

**Option 2: Focused on Architecture & Cloud (Strong for Fullstack roles)**
- Engineered a cloud-agnostic storage layer that abstracts local file systems and **AWS S3/MinIO**, implementing **presigned URLs** to enable secure, high-performance streaming directly from object storage to the client browser.

**Option 3: Focused on Performance & UX (Strong for Frontend/Fullstack roles)**
- Developed a high-performance dashboard with **drag-and-drop** functionality and recursive lifecycle management, reducing server load by offloading file downloads to the cloud and ensuring data consistency across relational databases and physical storage.

---

## 🎤 The 2-Minute Elevator Pitch

> "I built VaultDrive, a production-grade file management platform that solves the common security and scalability issues found in basic storage apps. 
> 
> The core challenge I tackled was **secure multi-tenancy**. I implemented a 'Security-by-Design' pattern where every data access point—from the API to the cloud storage bucket—is strictly scoped to the user session using Auth.js and scoped Prisma queries. 
> 
> Technically, I'm most proud of the **storage abstraction layer**. I didn't want the app tied to a single provider, so I built a system that swaps between local disk and AWS S3 with a single config change. When using S3, the app generates temporary signed URLs so users can stream files directly from the cloud. This keeps the server's CPU and memory usage very low even under heavy load. 
> 
> I also handled the complex edge cases, like **recursive folder deletion**, where a single UI action triggers a synchronized cleanup across the database and the S3 bucket to prevent 'orphaned' files."

---

## ❓ Interview FAQ

**Q: Why didn't you just use standard public URLs for S3 files?**
*A: Security and privacy. VaultDrive is built for private data. By using signed URLs, the files remain private in the bucket and are only accessible via a temporary token (expiring in 1 hour). This prevents unauthorized sharing and ensures only the logged-in owner can view their data.*

**Q: How do you ensure User A never sees User B's files?**
*A: I use a three-tier isolation strategy. First, Next.js Middleware protects the routes. Second, a `requireAuth` helper extracts the `userId` directly from the secure server-side session. Third, every Prisma query is explicitly filtered by `ownerId`. Even if someone guessed a file UUID, the database would return null because the owner ID wouldn't match.*

**Q: What would you scale or add next if this went to 1 million users?**
*A: I'd implement **multi-part uploads** for files over 5GB, add a **Redis-based rate limiter** for global API safety, and introduce **sharing permissions** with a many-to-many relationship in the database to support collaborative folders.*
