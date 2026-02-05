import crypto from "crypto";
import { promisify } from "util";

const scrypt = promisify(crypto.scrypt);

const SALT_LEN = 16;
const KEY_LEN = 32;

export async function hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(SALT_LEN).toString("hex");
    const derivedKey = (await scrypt(password, salt, KEY_LEN)) as Buffer;
    return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const [type, salt, hash] = storedHash.split(":");
    if (type !== "scrypt" || !salt || !hash) return false;

    const keyBuffer = Buffer.from(hash, "hex");
    const derivedKey = (await scrypt(password, salt, KEY_LEN)) as Buffer;

    return crypto.timingSafeEqual(keyBuffer, derivedKey);
}
