import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { safeResolveLocalPath } from "@/lib/storage";
import fs from "fs";

// Helper to stream file from disk
function streamFile(path: string): ReadableStream {
    // Use highWaterMark for better streaming performance usually, but default is fine
    const downloadStream = fs.createReadStream(path);

    return new ReadableStream({
        start(controller) {
            downloadStream.on("data", (chunk: any) => controller.enqueue(chunk));
            downloadStream.on("end", () => controller.close());
            downloadStream.on("error", (error: Error) => controller.error(error));
        },
        cancel() {
            if (!downloadStream.destroyed) downloadStream.destroy();
        },
    });
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAuth(req);
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    const { id } = await params;

    try {
        const file = await prisma.fileObject.findFirst({
            where: {
                id,
                ownerId: auth.ownerId,
                kind: "FILE",
            },
        });

        if (!file) {
            return NextResponse.json({ ok: false, error: "File not found" }, { status: 404 });
        }

        if (!file.localPath) {
            return NextResponse.json({ ok: false, error: "File path missing" }, { status: 404 });
        }

        // Resolve absolute path. FileObject.localPath is relative to process.cwd()
        let absPath: string;
        try {
            absPath = safeResolveLocalPath(file.localPath);
        } catch (e) {
            console.error("Security alert: Attempted traversal", file.localPath);
            return NextResponse.json({ ok: false, error: "Access denied" }, { status: 403 });
        }

        if (!fs.existsSync(absPath)) {
            return NextResponse.json({ ok: false, error: "File missing on disk" }, { status: 404 });
        }

        const stream = streamFile(absPath);

        const headers = new Headers();
        headers.set("Content-Type", file.mimeType || "application/octet-stream");

        // RFC 5987 Content-Disposition
        // filename="safe-fallback"
        // filename*=UTF-8''<encoded>
        const safeName = file.originalName.replace(/["\\]/g, ""); // Remove quotes and backslashes for safe fallback
        const encodedName = encodeURIComponent(file.originalName);
        headers.set("Content-Disposition", `attachment; filename="${safeName}"; filename*=UTF-8''${encodedName}`);

        headers.set("Content-Length", file.sizeBytes.toString());
        headers.set("Cache-Control", "no-store");

        return new NextResponse(stream, {
            status: 200,
            headers,
        });
    } catch (e: any) {
        console.error("Download error:", e);
        return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
    }
}
