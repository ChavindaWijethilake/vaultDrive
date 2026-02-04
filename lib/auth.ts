import { NextRequest } from "next/server";
import crypto from "crypto";

const COOKIE_NAME = "vd_session";

function secret() {
  return process.env.API_KEY || "";
}

function hmac(data: string) {
  return crypto.createHmac("sha256", secret()).update(data).digest("hex");
}

export function createSessionToken(payload: { ownerId: string }) {
  const body = Buffer.from(JSON.stringify({ ...payload, iat: Date.now() }), "utf8").toString("base64url");
  const sig = hmac(body);
  return `${body}.${sig}`;
}

export function verifySessionToken(token?: string | null) {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = hmac(body);
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const decoded = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!decoded?.ownerId) return null;
    return { ownerId: String(decoded.ownerId) };
  } catch {
    return null;
  }
}

export function requireAuth(req: NextRequest) {
  if (!process.env.API_KEY) {
    return { ok: false as const, status: 500, error: "API_KEY is missing in .env" };
  }

  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  const session = verifySessionToken(cookie);
  if (session) return { ok: true as const, ownerId: session.ownerId };

  const key = req.headers.get("x-api-key");
  if (key && key === process.env.API_KEY) {
    const ownerId = req.headers.get("x-owner-id") || "local-user";
    return { ok: true as const, ownerId };
  }

  return { ok: false as const, status: 401, error: "Unauthorized, please login." };
}

export const sessionCookie = {
  name: COOKIE_NAME,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};
