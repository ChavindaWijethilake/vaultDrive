# VaultDrive: Frontend Functional Logic

The VaultDrive frontend is a sophisticated Single Page Application (SPA) built with **Next.js 15 (App Router)** and **Tailwind CSS v4**.

---

## 🖥️ Core Dashboard (`app/page.tsx`)

### 1. State Hub
- **Navigation state**: `currentFolder` tracks the logical path (e.g., `/Work/Projects`).
- **Data state**: `folders` and `files` arrays are synchronized via `refresh()` whenever the path or search query changes.
- **Async states**: `listLoading` and `uploadProgress` drive the prismatic UI feedback bars.

### 2. High-Precision UI Components
- **Zero-Overlap Search**: Implements a dedicated span for the icon with `z-10` and `pl-14` spacing.
- **High-Density Table**: Uses `px-10 py-7` cell spacing for enterprise-grade legibility.
- **Responsive Navigation**: A mobile-first bottom nav bar provides quick access to core nodes (Drive, Upload, Logout).

### 3. Handler Logic
- **`uploadFile`**: Uses `FormData` to stream files to the backend while triggering a mock-progress UX for immediate feedback.
- **`handleRename/handleMove`**: Perform inline PATCH requests and trigger state re-validation on success.

---

# VaultDrive: API Backend Reference

VaultDrive exposes a secure set of RESTful endpoints protected by **NextAuth.js JWT** sessions.

---

## 📂 Resource Discovery

### `GET /api/files`
- **Purpose**: Paginated file retrieval.
- **Logic**: Combines `folderPath` filtering with case-insensitive `search` queries. Returns a `pagination` object for the frontend page controls.

### `GET /api/folders`
- **Purpose**: Dynamic directory listing.
- **Logic**: Retrieves children of a specific `parentPath`. Restricts results to the logged-in user.

---

## 📂 Resource Manipulation

### `POST /api/upload`
- **Logic**: 
    1. Extracts file bits via `request.formData()`.
    2. Writes to `uploads/[ownerId]/[filename]` using Node.js `fs`.
    3. Records metadata in PostgreSQL via Prisma.

### `PATCH /api/files/[id]`
- **Logic**: Universal update endpoint for `name` and `folderPath`. Triggers physical file renaming if necessary to maintain consistency (in cloud drivers).

### `DELETE /api/files/[id]`
- **Logic**: Performs a two-step purge: removes the physical file from disk via `lib/storage.ts` and then deletes the database record.
