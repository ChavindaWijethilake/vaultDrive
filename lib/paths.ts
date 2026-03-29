export function normalizePath(p: string) {
  if (!p) return "/";
  let s = p.trim().replace(/\\/g, "/");
  if (!s.startsWith("/")) s = "/" + s;
  if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1);
  return s;
}

export function joinPath(parent: string, child: string) {
  const p = normalizePath(parent);
  const c = String(child || "")
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  if (!c) return p;
  if (p === "/") return "/" + c;
  return p + "/" + c;
}
