import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizePath } from "@/lib/paths";
import { requireAuth } from "@/lib/auth";
import { jsonSafe } from "@/lib/serialize";

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

  try {
    const url = new URL(req.url);
    const folder = normalizePath(url.searchParams.get("folder") ?? "/");
    const search = String(url.searchParams.get("search") ?? "").trim();
    const page = parseInt(url.searchParams.get("page") ?? "1", 10) || 1;
    const limit = parseInt(url.searchParams.get("limit") ?? "20", 10) || 20;
    const ownerId = auth.ownerId;

    const where = {
      ownerId,
      kind: "FILE" as const,
      ...(search
        ? { originalName: { contains: search, mode: "insensitive" as const } }
        : { folderPath: folder }),
    };

    // Parallelize count and data fetch
    const [total, rows] = await Promise.all([
      prisma.fileObject.count({ where }),
      prisma.fileObject.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const files = rows.map((r: any) => ({
      id: r.id,
      originalName: r.originalName,
      storedName: r.storedName,
      folderPath: r.folderPath,
      mimeType: r.mimeType,
      sizeBytes: r.sizeBytes,
      createdAt: r.createdAt,
      downloadUrl: `/api/download/${encodeURIComponent(r.id)}`,
    }));

    return NextResponse.json(jsonSafe({
      ok: true,
      files,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }));
  } catch (e: any) {
    console.error("Files list error:", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
