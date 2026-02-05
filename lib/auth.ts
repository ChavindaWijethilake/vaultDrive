import { NextRequest } from "next/server";
import { validateRequest } from "@/lib/session";

export async function requireAuth(req: NextRequest): Promise<
  | { ok: true; ownerId: string }
  | { ok: false; status: number; error: string }
> {
  // 1. Check Session Cookie
  const sessionData = await validateRequest(req);
  if (sessionData) {
    return { ok: true, ownerId: sessionData.user.id };
  }

  // 2. Fallback: API Key (for backward compatibility/admin scripts)
  const authHeader = req.headers.get("authorization");
  const apiKeyHeader = req.headers.get("x-api-key");
  const providedKey = apiKeyHeader || (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

  // If no API key configured in env, strictly require session
  const validKey = process.env.API_KEY;

  // If user provided a KEY, check it
  if (providedKey && validKey && providedKey === validKey) {
    // Legacy/Admin access: assume "admin" owner
    return { ok: true, ownerId: "admin" };
  }

  return { ok: false, status: 401, error: "Unauthorized" };
}
