import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { normalizePath } from "@/lib/paths";
import { checkRateLimit } from "@/lib/ratelimit";
import crypto from "crypto";
import path from "path";
import { storage } from "@/src/storage";

export const runtime = "nodejs";

function safeExt(name: string) {
  const ext = path.extname(name || "").toLowerCase();
  if (ext.length > 10) return "";
  return ext;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "local";
  if (!checkRateLimit(ip, "upload", 30, 300)) {
    return NextResponse.json({ ok: false, error: "Too many uploads." }, { status: 429 });
  }

  const auth = await requireAuth();
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

  try {
    const ownerId = auth.ownerId;

    const form = await req.formData();
    const file = form.get("file") as File | null;
    const folderPath = normalizePath(String(form.get("folderPath") ?? "/"));

    if (!file) return NextResponse.json({ ok: false, error: "File is required." }, { status: 400 });

    // Validate max file size (25MB)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ ok: false, error: "File size exceeds 25MB limit." }, { status: 413 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = safeExt(file.name);
    // Unique stored name: timestamp + random + extension
    const storedName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;

    // Use storage abstraction to save the file
    const localPath = await storage.upload(ownerId, storedName, bytes);

    const row = await prisma.fileObject.create({
      data: {
        ownerId,
        kind: "FILE",
        folderPath,
        originalName: file.name,
        storedName,
        localPath,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: Number(file.size),
        replicationStatus: "PENDING",
      },
    });

    return NextResponse.json({ ok: true, id: row.id });
  } catch (e: any) {
    console.error("Upload API error:", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
