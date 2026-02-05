import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizePath } from "@/lib/paths";
import { requireAuth } from "@/lib/auth";
import { jsonSafe } from "@/lib/serialize";

export async function GET(req: NextRequest) {
    const auth = await requireAuth(req);
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    const url = new URL(req.url);
    const parent = normalizePath(url.searchParams.get("parent") ?? "/");
    const ownerId = auth.ownerId;

    try {
        // 1. Get explicit Folder markers
        const folderRows = await prisma.fileObject.findMany({
            where: {
                ownerId,
                kind: "FOLDER",
                folderPath: parent,
            },
            select: { originalName: true, createdAt: true, id: true },
        });

        // 2. Get implicit folders from File paths
        const fileFolders = await prisma.fileObject.findMany({
            where: {
                ownerId,
                kind: "FILE",
                folderPath: { startsWith: parent === "/" ? "/" : parent + "/" },
            },
            select: { folderPath: true },
            distinct: ["folderPath"]
        });

        const folderMap = new Map<string, { name: string, path: string, id: string, createdAt: Date }>();

        // Add implicit folders first
        for (const f of fileFolders) {
            let relative = "";
            if (parent === "/") {
                relative = f.folderPath.substring(1);
            } else {
                relative = f.folderPath.substring(parent.length + 1);
            }

            const parts = relative.split("/");
            const childName = parts[0];
            if (!childName) continue;

            const fullChildPath = parent === "/" ? "/" + childName : parent + "/" + childName;

            if (!folderMap.has(childName)) {
                folderMap.set(childName, {
                    name: childName,
                    path: fullChildPath,
                    id: "impl_" + childName,
                    createdAt: new Date(0)
                });
            }
        }

        // Add explicit markers (override implicit if exist)
        for (const r of folderRows) {
            const childPath = parent === "/" ? "/" + r.originalName : parent + "/" + r.originalName;
            folderMap.set(r.originalName, {
                name: r.originalName,
                path: childPath,
                id: r.id,
                createdAt: r.createdAt
            });
        }

        const folders = Array.from(folderMap.values()).sort((a, b) => {
            return b.createdAt.getTime() - a.createdAt.getTime();
        });

        return NextResponse.json(jsonSafe({ ok: true, folders }));
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const auth = await requireAuth(req);
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    try {
        const body = await req.json();
        const parentPath = normalizePath(body.parentPath || "/");
        const name = (body.name || "").trim();

        if (!name) return NextResponse.json({ ok: false, error: "Name required" }, { status: 400 });
        if (name.includes("/")) return NextResponse.json({ ok: false, error: "Invalid name" }, { status: 400 });

        const ownerId = auth.ownerId;

        // Check existing
        const existing = await prisma.fileObject.findFirst({
            where: {
                ownerId,
                kind: "FOLDER",
                folderPath: parentPath,
                originalName: name
            }
        });

        if (existing) {
            return NextResponse.json({ ok: true, id: existing.id });
        }

        // Create marker
        const row = await prisma.fileObject.create({
            data: {
                ownerId,
                kind: "FOLDER",
                folderPath: parentPath,
                originalName: name,
                storedName: "folder_marker",
                localPath: "",
                mimeType: "application/x-directory",
                sizeBytes: 0
            }
        });

        return NextResponse.json({ ok: true, id: row.id });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const auth = await requireAuth(req);
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    const url = new URL(req.url);
    const path = normalizePath(url.searchParams.get("path") ?? "");
    const ownerId = auth.ownerId;

    if (!path || path === "/") {
        return NextResponse.json({ ok: false, error: "Invalid folder path" }, { status: 400 });
    }

    try {
        const deleteRes = await prisma.fileObject.deleteMany({
            where: {
                ownerId,
                OR: [
                    { folderPath: path },
                    { folderPath: { startsWith: path + "/" } }
                ]
            }
        });

        const parent = path.substring(0, path.lastIndexOf("/")) || "/";
        const name = path.substring(path.lastIndexOf("/") + 1);

        await prisma.fileObject.deleteMany({
            where: {
                ownerId,
                kind: "FOLDER",
                folderPath: parent,
                originalName: name
            }
        });

        return NextResponse.json({ ok: true, deletedCount: deleteRes.count });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}
