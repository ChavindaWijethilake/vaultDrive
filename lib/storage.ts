import path from "path";
import fs from "fs/promises";

/**
 * Returns the absolute path to the uploads root directory.
 */
export function uploadsRootAbs() {
    return path.resolve(process.cwd(), "uploads");
}

/**
 * Resolves a relative path to an absolute path within the uploads directory.
 * Throws an error if the resolved path attempts to traverse outside uploadsRootAbs.
 */
export function safeResolveLocalPath(localPath: string) {
    const root = uploadsRootAbs();
    const abs = path.resolve(root, localPath);
    if (!abs.startsWith(root)) {
        throw new Error("Invalid file path.");
    }
    return abs;
}

/**
 * Deletes a file from the local filesystem if it exists.
 * Safe to call even if the file is already gone (ignores ENOENT).
 */
export async function deleteLocalFileIfExists(localPath: string) {
    try {
        const abs = safeResolveLocalPath(localPath);
        await fs.unlink(abs);
    } catch (error: any) {
        if (error.code === "ENOENT") {
            // File not found, considered a success for "delete if exists"
            return;
        }
        console.error(`Failed to delete file ${localPath}:`, error);
        // We do not throw here to allow DB delete to proceed if desired, 
        // but typically we might want to know. 
        // The prompt requirements implied void return or consistent with goal.
        // Prompt says: export async function deleteLocalFileIfExists(localPath: string): Promise<void>
    }
}

/**
 * Ensures the upload directory for a specific owner exists.
 * Returns the absolute path to the owner's directory.
 */
export async function ensureUploadsDir(ownerId: string) {
    const root = uploadsRootAbs();
    const dir = path.join(root, ownerId);
    // Ensure we are still inside root
    if (!dir.startsWith(root)) {
        throw new Error("Invalid owner directory.");
    }
    await fs.mkdir(dir, { recursive: true });
    return dir;
}

/**
 * Determines if a file is suitable for inline preview.
 */
export function isPreviewable(mimeType: string): boolean {
    if (!mimeType) return false;
    return (
        mimeType.startsWith("image/") ||
        mimeType.startsWith("text/") ||
        mimeType === "application/pdf"
    );
}
