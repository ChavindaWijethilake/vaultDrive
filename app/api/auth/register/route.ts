import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password || password.length < 6) {
            return NextResponse.json({ ok: false, error: "Invalid email or weak password" }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ ok: false, error: "Email already registered" }, { status: 400 });
        }

        const passwordHash = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
            },
        });

        const { token, sessionCookieName, expiresAt } = await createSession(user.id);

        const res = NextResponse.json({ ok: true });
        res.cookies.set(sessionCookieName, token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            expires: expiresAt,
            path: "/",
        });

        return res;
    } catch (e: any) {
        console.error("Register error:", e);
        return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
    }
}
