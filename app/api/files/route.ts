import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizePath } from "@/lib/paths";
import { requireAuth } from "@/lib/auth";
import { jsonSafe } from "@/lib/serialize";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

  try {
    const url = new URL(req.url);
    const folder = normalizePath(url.searchParams.get("folder") ?? "/");
    const search = String(url.searchParams.get("search") ?? "").trim();
    const ownerId = auth.ownerId;

    const rows = await prisma.fileObject.findMany({
      where: {
        ownerId,
        kind: "FILE",
        folderPath: folder,
        ...(search
          ? { originalName: { contains: search, mode: "insensitive" } }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 300,
    });

    const files = rows.map((r) => ({
      id: r.id,
      originalName: r.originalName,
      storedName: r.storedName,
      folderPath: r.folderPath,
      mimeType: r.mimeType,
      sizeBytes: r.sizeBytes,
      createdAt: r.createdAt,
      downloadUrl: `/api/download/${encodeURIComponent(r.id)}`,
    }));

    return NextResponse.json(jsonSafe({ ok: true, files }));
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
