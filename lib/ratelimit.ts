type RateLimitStore = Map<string, { count: number; expiresAt: number }>;

const limits: Record<string, RateLimitStore> = {};

export function checkRateLimit(
    ip: string,
    action: "login" | "upload",
    limit: number,
    durationSeconds: number
) {
    if (!limits[action]) {
        limits[action] = new Map();
    }

    const store = limits[action];
    const now = Date.now();
    const key = ip;

    const record = store.get(key);

    // Clean up expired
    if (record && now > record.expiresAt) {
        store.delete(key);
    }

    // Create new if missing or expired
    const current = store.get(key) || { count: 0, expiresAt: now + durationSeconds * 1000 };

    if (current.count >= limit) {
        return false;
    }

    current.count++;
    store.set(key, current);

    // Periodic cleanup (optional optimization)
    if (store.size > 10000) {
        for (const [k, v] of store.entries()) {
            if (now > v.expiresAt) store.delete(k);
        }
    }

    return true;
}
