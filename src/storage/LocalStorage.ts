import { StorageProvider } from "./StorageProvider";
import path from "path";
import fs from "fs/promises";
import { createReadStream, existsSync } from "fs";

export class LocalStorage implements StorageProvider {
    private uploadsRoot: string;

    constructor() {
        this.uploadsRoot = path.resolve(process.cwd(), "uploads");
    }

    private safeResolve(localPath: string): string {
        const abs = path.resolve(this.uploadsRoot, localPath);
        if (!abs.startsWith(this.uploadsRoot)) {
            throw new Error("Invalid file path: path traversal detected.");
        }
        return abs;
    }

    async upload(ownerId: string, storedName: string, buffer: Buffer): Promise<string> {
        const ownerDir = path.join(this.uploadsRoot, ownerId);

        // Ensure owner directory exists
        await fs.mkdir(ownerDir, { recursive: true });

        const absPath = path.join(ownerDir, storedName);
        if (!absPath.startsWith(this.uploadsRoot)) {
            throw new Error("Invalid owner directory.");
        }

        await fs.writeFile(absPath, buffer);

        // Return path relative to project root for backward compatibility with existing DB entries
        return path.relative(process.cwd(), absPath).replace(/\\/g, "/");
    }

    async download(pathOrKey: string): Promise<ReadableStream> {
        const absPath = path.resolve(process.cwd(), pathOrKey); // Compatibility with existing DB entries
        // Still protect against traversal relative to project root if needed, 
        // but typically we should resolve relative to uploadsRoot.
        // For now, let's keep it consistent with the existing safeResolveLocalPath logic.

        const root = path.resolve(process.cwd(), "uploads");
        if (!absPath.startsWith(root)) {
            throw new Error("Access denied: Invalid file path.");
        }

        if (!existsSync(absPath)) {
            throw new Error("File not found on disk.");
        }

        const nodeStream = createReadStream(absPath);

        return new ReadableStream({
            start(controller) {
                nodeStream.on("data", (chunk) => controller.enqueue(chunk));
                nodeStream.on("end", () => controller.close());
                nodeStream.on("error", (err) => controller.error(err));
            },
            cancel() {
                if (!nodeStream.destroyed) nodeStream.destroy();
            },
        });
    }

    async delete(pathOrKey: string): Promise<void> {
        try {
            const absPath = path.resolve(process.cwd(), pathOrKey);
            const root = path.resolve(process.cwd(), "uploads");
            if (!absPath.startsWith(root)) {
                throw new Error("Access denied: Invalid file path.");
            }

            await fs.unlink(absPath);
        } catch (error: any) {
            if (error.code !== "ENOENT") {
                console.error(`Failed to delete local file ${pathOrKey}:`, error);
                throw error;
            }
        }
    }

    async exists(pathOrKey: string): Promise<boolean> {
        const absPath = path.resolve(process.cwd(), pathOrKey);
        const root = path.resolve(process.cwd(), "uploads");
        return absPath.startsWith(root) && existsSync(absPath);
    }

    async getSignedDownloadUrl(pathOrKey: string, expiresSeconds?: number): Promise<string> {
        // For local storage, we don't have a true 'signed URL' from a cloud provider.
        // We'll return our internal preview/download API endpoint.
        // In a real production app, you might add a temporary JWT token to this URL.
        return `/api/download-direct?key=${encodeURIComponent(pathOrKey)}`;
    }
}
