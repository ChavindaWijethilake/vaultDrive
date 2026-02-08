import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const bodyText = await req.text();
        console.log("Register raw body:", bodyText);
        const { email, password } = JSON.parse(bodyText);

        if (!email || !password || password.length < 6) {
            return NextResponse.json({ ok: false, error: "Invalid email or weak password" }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ ok: false, error: "Email already registered" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        // After registration, we let the user log in via the standard login flow
        return NextResponse.json({ ok: true });
    } catch (e: any) {
        console.error("Register error:", e);
        return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
    }
}
