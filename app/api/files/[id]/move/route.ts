import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { normalizePath } from "@/lib/paths";
import { jsonSafe } from "@/lib/serialize";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = requireAuth(req);
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    const { id } = await params;

    try {
        const body = await req.json();
        let folderPath = body.folderPath;

        if (typeof folderPath !== "string") {
            return NextResponse.json({ ok: false, error: "Invalid folder path" }, { status: 400 });
        }

        folderPath = normalizePath(folderPath);

        // Validate path characters?
        if (folderPath.includes("\0")) {
            return NextResponse.json({ ok: false, error: "Invalid characters" }, { status: 400 });
        }

        // Only update folderPath, do not move file on disk
        await prisma.fileObject.update({
            where: {
                id,
                ownerId: auth.ownerId,
            },
            data: {
                folderPath,
            },
        });

        return NextResponse.json(jsonSafe({ ok: true }));
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e?.message || "Move failed" }, { status: 500 });
    }
}
