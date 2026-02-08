# VaultDrive: API Backend Reference

VaultDrive exposes a secure set of RESTful endpoints protected by **NextAuth.js JWT** sessions.

---

## 📂 Resource Discovery

### `GET /api/files?folder=[path]&search=[query]&page=[n]&limit=[m]`
- **Purpose**: Paginated file retrieval.
- **Location**: `app/api/files/route.ts`
- **Logic**: Combines `folderPath` filtering with case-insensitive `search` queries. Returns a `pagination` object with `total`, `page`, `limit`, and `totalPages`.

### `GET /api/folders?parent=[path]&search=[query]`
- **Purpose**: Dynamic directory listing.
- **Location**: `app/api/folders/route.ts`
- **Logic**: Retrieves children of a specific `parentPath`. Restricted to the logged-in user's data.

---

## 📂 Resource Manipulation

### `POST /api/upload`
- **Purpose**: File ingestion and database registration.
- **Location**: `app/api/upload/route.ts`
- **Logic**: 
    1. Extracts file bits via `request.formData()`.
    2. Writes to `uploads/[ownerId]/[filename]` using `fs`.
    3. Records metadata (name, size, type) in the Database.

### `PATCH /api/files/[id]`
- **Purpose**: Universal update (rename/move).
- **Location**: `app/api/files/[id]/route.ts`
- **Logic**: Updates the database record. Renaming the physical file is not strictly necessary in the local driver but handles metadata consistency.

### `DELETE /api/files/[id]`
- **Purpose**: Absolute purging of data.
- **Location**: `app/api/files/[id]/route.ts`
- **Logic**: 
    1. Resolves physical path via `lib/storage.ts`.
    2. Unlinks file from filesystem.
    3. Purges database record.
