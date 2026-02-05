import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { safeResolveLocalPath, isPreviewable } from "@/lib/storage";
import fs from "fs/promises";

export const runtime = "nodejs";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const auth = await requireAuth(req);
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    try {
        const { id } = await ctx.params;
        const ownerId = auth.ownerId;

        // Find row by id + ownerId + kind="FILE"
        const file = await prisma.fileObject.findFirst({
            where: { id, ownerId, kind: "FILE" },
        });

        if (!file) {
            return NextResponse.json({ ok: false, error: "File not found." }, { status: 404 });
        }

        // Validate localPath is under uploads root
        let absPath: string;
        try {
            absPath = safeResolveLocalPath(file.localPath);
        } catch (e) {
            return NextResponse.json({ ok: false, error: "Access denied: invalid file path." }, { status: 403 });
        }

        const fileBuf = await fs.readFile(absPath);
        const filename = encodeURIComponent(file.originalName);

        // If isPreviewable(mime): return response with inline, else attachment
        // If the goal requires 400 not previewable, we implement that check.
        // Prompt said: "If !isPreviewable(row.mimeType), return 400 with { ok:false, error:"Not previewable." }"
        if (!isPreviewable(file.mimeType || "")) {
            return NextResponse.json({ ok: false, error: "Not previewable." }, { status: 400 });
        }

        return new NextResponse(fileBuf, {
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
