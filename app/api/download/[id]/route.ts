import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { storage } from "@/src/storage";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAuth();
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

        let stream: ReadableStream;
        try {
            stream = await storage.download(file.localPath);
        } catch (e: any) {
            console.error("Storage download error:", e);
            return NextResponse.json({ ok: false, error: e.message || "File missing" }, { status: 404 });
        }

        const headers = new Headers();
        headers.set("Content-Type", file.mimeType || "application/octet-stream");

        // RFC 5987 Content-Disposition
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
