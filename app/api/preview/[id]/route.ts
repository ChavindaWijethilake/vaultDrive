import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { isPreviewable } from "@/lib/storage";
import { storage } from "@/src/storage";

export const runtime = "nodejs";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const auth = await requireAuth();
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    try {
        const { id } = await ctx.params;
        const ownerId = auth.ownerId;

        const file = await prisma.fileObject.findFirst({
            where: { id, ownerId, kind: "FILE" },
        });

        if (!file) {
            return NextResponse.json({ ok: false, error: "File not found." }, { status: 404 });
        }

        if (!isPreviewable(file.mimeType || "")) {
            return NextResponse.json({ ok: false, error: "Not previewable." }, { status: 400 });
        }

        if (!file.localPath) {
            return NextResponse.json({ ok: false, error: "File path missing." }, { status: 404 });
        }

        let stream: ReadableStream;
        try {
            stream = await storage.download(file.localPath);
        } catch (e: any) {
            return NextResponse.json({ ok: false, error: e.message || "File missing." }, { status: 404 });
        }

        const filename = encodeURIComponent(file.originalName);

        return new NextResponse(stream, {
            headers: {
                "Content-Type": file.mimeType || "application/octet-stream",
                "Content-Disposition": `inline; filename="${filename}"`,
            },
        });
    } catch (e: any) {
        console.error("Preview API error:", e);
        return NextResponse.json({ ok: false, error: e?.message ?? "Unknown error" }, { status: 500 });
    }
}
