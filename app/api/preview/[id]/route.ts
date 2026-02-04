import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import path from "path";
import fs from "fs";

// Helper to stream file from disk
function streamFile(path: string): ReadableStream {
    const downloadStream = fs.createReadStream(path);

    return new ReadableStream({
        start(controller) {
            downloadStream.on("data", (chunk: Buffer) => controller.enqueue(chunk));
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
    const auth = requireAuth(req);
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

        const absPath = path.resolve(process.cwd(), file.localPath);
        const uploadsRoot = path.join(process.cwd(), "uploads");
        if (!absPath.startsWith(uploadsRoot)) {
            return NextResponse.json({ ok: false, error: "Access denied" }, { status: 403 });
        }

        if (!fs.existsSync(absPath)) {
            return NextResponse.json({ ok: false, error: "File missing on disk" }, { status: 404 });
        }

        const stream = streamFile(absPath);
        const headers = new Headers();

        // Check for allowed inline types
        const mime = file.mimeType || "application/octet-stream";
        const isInline = mime.startsWith("image/") || mime === "application/pdf";
        const disposition = isInline ? "inline" : "attachment";

        headers.set("Content-Type", mime);

        const safeName = file.originalName.replace(/["\\]/g, "");
        const encodedName = encodeURIComponent(file.originalName);
        headers.set("Content-Disposition", `${disposition}; filename="${safeName}"; filename*=UTF-8''${encodedName}`);

        headers.set("Content-Length", file.sizeBytes.toString());
        headers.set("Cache-Control", "no-store");

        return new NextResponse(stream, {
            status: 200,
            headers,
        });
    } catch (e: any) {
        console.error("Preview error:", e);
        return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
    }
}
