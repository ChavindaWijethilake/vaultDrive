import { auth } from "@/auth";

export async function requireAuth(): Promise<
  | { ok: true; ownerId: string }
  | { ok: false; status: number; error: string }
> {
  const session = await auth();

  if (session?.user?.id) {
    return { ok: true, ownerId: session.user.id as string };
  }

  return { ok: false, status: 401, error: "Unauthorized" };
}
