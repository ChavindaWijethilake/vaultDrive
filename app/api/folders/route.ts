import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizePath } from "@/lib/paths";
import { requireAuth } from "@/lib/auth";
import { storage } from "@/src/storage";
import { jsonSafe } from "@/lib/serialize";

export async function GET(req: NextRequest) {
    const auth = await requireAuth();
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    const url = new URL(req.url);
    const parent = normalizePath(url.searchParams.get("parent") ?? "/");
    const search = String(url.searchParams.get("search") ?? "").trim();
    const page = parseInt(url.searchParams.get("page") ?? "1", 10) || 1;
    const limit = parseInt(url.searchParams.get("limit") ?? "50", 10) || 50;
    const isTrash = url.searchParams.get("trash") === "true";
    const isPriority = url.searchParams.get("priority") === "true";
    const ownerId = auth.ownerId;

    try {
        if (search) {
            // GLOBAL SEARCH for folders (explicit markers only for performance)
            const [total, rows] = await Promise.all([
                prisma.fileObject.count({
                    where: {
                        ownerId,
                        kind: "FOLDER",
                        originalName: { contains: search, mode: "insensitive" },
                    }
                }),
                prisma.fileObject.findMany({
                    where: {
                        ownerId,
                        kind: "FOLDER",
                        originalName: { contains: search, mode: "insensitive" },
                    },
                    orderBy: { createdAt: "desc" },
                    skip: (page - 1) * limit,
                    take: limit,
                })
            ]);

            const folders = rows.map(r => ({
                name: r.originalName,
                path: r.folderPath === "/" ? "/" + r.originalName : r.folderPath + "/" + r.originalName,
                id: r.id,
                createdAt: r.createdAt,
                isPriority: (r as any).isPriority
            }));

            return NextResponse.json(jsonSafe({
                ok: true,
                folders,
                pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
            }));
        }

        // NAVIGATION MODE (Parent-child hierarchy or Flat mode)
        const isFlat = isTrash || isPriority;

        const folderRows = await prisma.fileObject.findMany({
            where: {
                ownerId,
                kind: "FOLDER",
                ...(isFlat ? {} : { folderPath: parent }),
            },
            select: { originalName: true, createdAt: true, id: true, folderPath: true, isPriority: true },
        });

        if (isFlat) {
            const folders = folderRows.map(r => ({
                name: r.originalName,
                path: r.folderPath === "/" ? "/" + r.originalName : r.folderPath + "/" + r.originalName,
                id: r.id,
                createdAt: r.createdAt,
                isPriority: (r as any).isPriority
            })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

            return NextResponse.json(jsonSafe({
                ok: true,
                folders,
                pagination: { total: folders.length, page: 1, limit: folders.length, totalPages: 1 }
            }));
        }

        const fileFolders = await prisma.fileObject.findMany({
            where: {
                ownerId,
                kind: "FILE",
                folderPath: { startsWith: parent === "/" ? "/" : parent + "/" },
            },
            select: { folderPath: true },
            distinct: ["folderPath"]
        });

        const folderMap = new Map<string, { name: string, path: string, id: string, createdAt: Date, isPriority: boolean }>();

        for (const f of fileFolders) {
            let relative = parent === "/" ? f.folderPath.substring(1) : f.folderPath.substring(parent.length + 1);
            const childName = relative.split("/")[0];
            if (!childName) continue;

            const fullChildPath = parent === "/" ? "/" + childName : parent + "/" + childName;
            if (!folderMap.has(childName)) {
                folderMap.set(childName, {
                    name: childName,
                    path: fullChildPath,
                    id: "impl_" + childName,
                    createdAt: new Date(0),
                    isPriority: false
                });
            }
        }

        for (const r of folderRows) {
            const childPath = r.folderPath === "/" ? "/" + r.originalName : r.folderPath + "/" + r.originalName;
            folderMap.set(r.originalName, {
                name: r.originalName,
                path: childPath,
                id: r.id,
                createdAt: r.createdAt,
                isPriority: (r as any).isPriority
            });
        }

        let folders = Array.from(folderMap.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        const total = folders.length;
        folders = folders.slice((page - 1) * limit, page * limit);

        return NextResponse.json(jsonSafe({
            ok: true,
            folders,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
        }));
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const auth = await requireAuth();
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    try {
        const body = await req.json();
        const parentPath = normalizePath(body.parentPath || "/");
        const name = (body.name || "").trim();
        const ownerId = auth.ownerId;

        if (!name) return NextResponse.json({ ok: false, error: "Name required" }, { status: 400 });

        const existing = await prisma.fileObject.findFirst({
            where: { ownerId, kind: "FOLDER", folderPath: parentPath, originalName: name }
        });

        if (existing) return NextResponse.json({ ok: true, id: existing.id });

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
    const auth = await requireAuth();
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    const url = new URL(req.url);
    const path = normalizePath(url.searchParams.get("path") ?? "");
    const ownerId = auth.ownerId;

    if (!path || path === "/") return NextResponse.json({ ok: false, error: "Invalid folder path" }, { status: 400 });

    try {
        const permanent = url.searchParams.get("permanent") === "true";
            // Soft delete removed - logical deletion not in schema
            return NextResponse.json({ ok: true, soft: false, note: "Soft delete disabled" });

        // 1. Fetch all files in this folder and subfolders to delete from storage
        const filesToDelete = await prisma.fileObject.findMany({
            where: {
                ownerId,
                kind: "FILE",
                OR: [
                    { folderPath: path },
                    { folderPath: { startsWith: path + "/" } }
                ]
            },
            select: { localPath: true }
        });

        // 2. Delete files from storage provider
        await Promise.all(filesToDelete.map(f => storage.delete(f.localPath)));

        // 3. Delete all records (files and folders) in this hierarchy
        const deleteRes = await prisma.fileObject.deleteMany({
            where: {
                ownerId,
                OR: [
                    { folderPath: path },
                    { folderPath: { startsWith: path + "/" } },
                    // Also delete the folder marker itself
                    {
                        kind: "FOLDER",
                        folderPath: path.substring(0, path.lastIndexOf("/")) || "/",
                        originalName: path.substring(path.lastIndexOf("/") + 1)
                    }
                ]
            }
        });

        return NextResponse.json({ ok: true, deletedCount: deleteRes.count });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}
