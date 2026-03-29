import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { jsonSafe } from "@/lib/serialize";

export async function GET(req: NextRequest) {
    const auth = await requireAuth();
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    try {
        const ownerId = auth.ownerId;

        const [user, usage] = await Promise.all([
            prisma.user.findUnique({
                where: { id: ownerId },
                select: { maxStorage: true }
            }),
            prisma.fileObject.aggregate({
                where: { ownerId, kind: "FILE" },
                _sum: { sizeBytes: true }
            })
        ]);

        return NextResponse.json(jsonSafe({
            ok: true,
            used: usage._sum.sizeBytes || 0,
            quota: user?.maxStorage || 1073741824
        }));
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}
