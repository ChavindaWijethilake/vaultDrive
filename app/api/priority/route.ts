import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const auth = await requireAuth();
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    try {
        const body = await req.json();
        const { id, isPriority, type } = body;

        if (!id) return NextResponse.json({ ok: false, error: "ID required" }, { status: 400 });

        if (type === 'folder') {
            // Folders are also FileObjects in this schema
            await prisma.fileObject.update({
                where: { id, ownerId: auth.ownerId },
                data: { isPriority: Boolean(isPriority) } as any
            });
        } else {
            await prisma.fileObject.update({
                where: { id, ownerId: auth.ownerId },
                data: { isPriority: Boolean(isPriority) } as any
            });
        }

        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}
