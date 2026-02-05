import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";
import { deleteLocalFileIfExists } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
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

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

  try {
    const { id } = await ctx.params;
    const ownerId = auth.ownerId;

    // Find row by id + ownerId + kind="FILE"
    const row = await prisma.fileObject.findFirst({
      where: { id, ownerId, kind: "FILE" },
    });

    if (!row) {
      return NextResponse.json({ ok: false, error: "File not found." }, { status: 404 });
    }

    // Call deleteLocalFileIfExists(row.localPath)
    // This function swallows ENOENT so it's safe if file missing.
    // It returns void, so we don't check .ok
    await deleteLocalFileIfExists(row.localPath);

    // Delete DB row
    await prisma.fileObject.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Delete API error:", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
