import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "vd_session";

// 7 days expiration
const EXPIRES_IN_MS = 7 * 24 * 60 * 60 * 1000;

export async function createSession(userId: string) {
    // Generate random token
    const token = crypto.randomBytes(32).toString("hex");
    // Hash token for database storage
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const expiresAt = new Date(Date.now() + EXPIRES_IN_MS);

    await prisma.session.create({
        data: {
            userId,
            tokenHash,
            expiresAt,
        },
    });

    return { token, sessionCookieName: SESSION_COOKIE_NAME, expiresAt };
}

export async function validateRequest(req: NextRequest) {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const session = await prisma.session.findUnique({
        where: { tokenHash },
        include: { user: true },
    });

    if (!session) return null;

    if (session.expiresAt < new Date()) {
        await prisma.session.delete({ where: { id: session.id } });
        return null;
    }

    // Optional: sliding expiration could be added here
    return { user: session.user, session };
}

export async function destroySession(token: string) {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    try {
        await prisma.session.delete({ where: { tokenHash } });
    } catch {
        // Ignore if already missing
    }
}

export { SESSION_COOKIE_NAME };
