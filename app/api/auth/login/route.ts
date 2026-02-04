import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, sessionCookie } from "@/lib/auth";
import { checkRateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
    const ip = req.headers.get("x-forwarded-for") || "local";
    if (!checkRateLimit(ip, "login", 10, 300)) {
        return NextResponse.json({ ok: false, error: "Too many login attempts." }, { status: 429 });
    }

    const body = await req.json().catch(() => null);

    const apiKey = String(body?.apiKey ?? "");
    const ownerId = String(body?.ownerId ?? "local-user");

    if (!process.env.API_KEY) {
        return NextResponse.json({ ok: false, error: "Server API_KEY missing." }, { status: 500 });
    }

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return NextResponse.json({ ok: false, error: "Invalid API key." }, { status: 401 });
    }

    const token = createSessionToken({ ownerId });
    const res = NextResponse.json({ ok: true, ownerId });
    res.cookies.set(sessionCookie.name, token, sessionCookie);
    return res;
}
