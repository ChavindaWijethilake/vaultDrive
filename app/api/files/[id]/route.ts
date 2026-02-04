import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

  try {
    const { id } = await ctx.params;
    const ownerId = auth.ownerId;

    const row = await prisma.fileObject.findFirst({
      where: { id, ownerId, kind: "FILE" },
    });

    if (!row) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });

    // Only allow paths under project uploads directory
    const abs = path.resolve(process.cwd(), row.localPath);
    const uploadsRoot = path.resolve(process.cwd(), "uploads");
    if (!abs.startsWith(uploadsRoot)) {
      return NextResponse.json({ ok: false, error: "Invalid file path." }, { status: 400 });
    }

    const fileBuf = await fs.readFile(abs);

    return new NextResponse(fileBuf, {
      headers: {
        "Content-Type": row.mimeType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(row.originalName)}"`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
