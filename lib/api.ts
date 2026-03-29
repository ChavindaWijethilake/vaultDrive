// lib/api.ts
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

function withKey(headers?: HeadersInit): HeadersInit {
  return {
    ...(headers ?? {}),
    "x-api-key": API_KEY,
  };
}

export async function apiFetch(input: RequestInfo | URL, init?: RequestInit) {
  return fetch(input, {
    ...init,
    headers: withKey(init?.headers),
    cache: "no-store",
  });
}
