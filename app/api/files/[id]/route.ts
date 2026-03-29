import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { storage } from "@/src/storage";
import { jsonSafe } from "@/lib/serialize";

export const runtime = "nodejs";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

  try {
    const { id } = await params;
    const ownerId = auth.ownerId;
    const url = new URL(req.url);
    const signed = url.searchParams.get("signed") === "true";

    const row = await prisma.fileObject.findFirst({
      where: { id, ownerId },
    });

    if (!row) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });

    if (!row.localPath) {
      return NextResponse.json({ ok: false, error: "File path missing." }, { status: 404 });
    }

    if (signed) {
      const signedUrl = await storage.getSignedDownloadUrl(row.localPath);
      return NextResponse.json({ ok: true, url: signedUrl });
    }

    let stream: ReadableStream;
    try {
      stream = await storage.download(row.localPath);
    } catch (e: any) {
      return NextResponse.json({ ok: false, error: e.message || "File missing." }, { status: 404 });
    }

    return new NextResponse(stream, {
      headers: {
        "Content-Type": row.mimeType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(row.originalName)}"`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

  try {
    const { id } = await params;
    const body = await req.json();
    const { newName, newFolderPath, restore } = body;

    const data: any = {};
    if (newName !== undefined) data.originalName = String(newName).trim();
    if (newFolderPath !== undefined) data.folderPath = String(newFolderPath).trim();


    if (Object.keys(data).length === 0) {
      return NextResponse.json({ ok: false, error: "No changes provided" }, { status: 400 });
    }

    await prisma.fileObject.update({
      where: { id, ownerId: auth.ownerId },
      data,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

  try {
    const { id } = await params;
    const ownerId = auth.ownerId;
    const url = new URL(req.url);
    const permanent = url.searchParams.get("permanent") === "true";

    const row = await prisma.fileObject.findFirst({
      where: { id, ownerId },
    });

    if (!row) {
      return NextResponse.json({ ok: false, error: "File not found." }, { status: 404 });
    }

    if (permanent) {
      if (row.localPath) {
        await storage.delete(row.localPath);
      }

      await prisma.fileObject.delete({
        where: { id },
      });
      return NextResponse.json({ ok: true, permanent: true });
    } else {
      // Hard delete as fallback for soft delete (not in schema)
      await prisma.fileObject.delete({
        where: { id },
      });
      return NextResponse.json({ ok: true, note: "Logical delete not in schema, performed hard delete." });
    }
  } catch (e: any) {
    console.error("Delete API error:", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
