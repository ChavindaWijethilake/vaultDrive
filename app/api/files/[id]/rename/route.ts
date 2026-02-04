import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
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
        const newName = String(body.newName || "").trim();

        if (!newName) {
            return NextResponse.json({ ok: false, error: "New name is required" }, { status: 400 });
        }

        // Only update originalName, not storedName or localPath
        // This ensures disk integrity is untouched
        await prisma.fileObject.update({
            where: {
                id,
                ownerId: auth.ownerId,
            },
            data: {
                originalName: newName,
            },
        });

        return NextResponse.json(jsonSafe({ ok: true }));
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e?.message || "Update failed" }, { status: 500 });
    }
}
