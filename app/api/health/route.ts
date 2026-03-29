import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import net from "net";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function checkRedis(): Promise<"ok" | "fail" | "skip"> {
  const url = process.env.REDIS_URL;
  if (!url) return "skip";

  try {
    // Parse redis://host:port or redis://user:pass@host:port
    const u = new URL(url);
    const host = u.hostname;
    const port = parseInt(u.port || "6379", 10);

    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(1000); // 1s timeout

      socket.on("connect", () => {
        socket.destroy();
        resolve("ok");
      });

      socket.on("timeout", () => {
        socket.destroy();
        resolve("fail");
      });

      socket.on("error", (err) => {
        console.error("Redis health check error:", err);
        socket.destroy();
        resolve("fail");
      });

      socket.connect(port, host);
    });
  } catch (e) {
    console.error("Redis URL parse error:", e);
    return "fail";
  }
}

export async function GET() {
  const status = {
    ok: true,
    time: new Date().toISOString(),
    db: "ok",
    redis: "skip",
    storage: process.env.STORAGE_DRIVER || "local",
  };

  try {
    // Check DB
    await prisma.fileObject.count();
  } catch (e) {
    console.error("Health DB check failed:", e);
    status.db = "fail";
    status.ok = false;
  }

  // Check Redis
  status.redis = await checkRedis();
  if (status.redis === "fail") {
    // Optional: decide if redis failure makes overall status false.
    // Prompt said { ok: true, ... } structure. 
    // Usually if dependency fails, health is false. 
    // But since app works without redis (in-memory fallback?), strictly, maybe ok?
    // Given the prompt asked for "db: ok|fail", "redis: ok|skip", and "ok: true",
    // I will set ok=false if any check fails to be safe.
    status.ok = false;
  }

  return NextResponse.json(status, { status: status.ok ? 200 : 503 });
}
