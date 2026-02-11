# Architecture: API Handlers

The `app/api/` directory contains the server-side logic for VaultDrive. Every route is protected by session verification.

## 1. File & Folder Listing (`/api/files` & `/api/folders`)
- **Function**: Retrieves metadata for the requested path.
- **Logic**: 
    - Queries the Prisma database for objects where `ownerId === user.id`.
    - Filters by `folderPath` to simulate a directory structure.
    - Supports `search` queries with case-insensitive filtering.

## 2. Secure Upload (`/api/upload`)
- **Function**: Handles multi-part form data for file uploads.
- **Process**:
    1.  Verifies the user's available storage quota.
    2.  Writes the file to the local `uploads/` directory with a UUID name.
    3.  Creates a record in the `FileObject` table.
    4.  Triggers a background replication job (if S3 is enabled).

## 3. Data Retrieval (`/api/download` & `/api/preview`)
- **Function**: Serves raw bytes or preview streams.
- **Security**: 
    - Verifies ownership before streaming the file.
    - Sets appropriate `Content-Disposition` headers for downloads vs. inline previews.

## 4. Object Deletion (`/api/files/delete` & `/api/folders/delete`)
- **Function**: Removes objects from both the database and physical storage.
- **Recursive Logic**: 
    - When a **Folder** is deleted, the API recursively finds every child object (nested files and subfolders) and purges them to prevent "ghost" data consumption.
