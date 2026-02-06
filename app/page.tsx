"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

type FolderRow = {
  id: string;
  name: string;
  path: string;
  createdAt: string;
};

type FileRow = {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
  folderPath: string;
  downloadUrl: string;
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

function normalizePath(p: string) {
  if (!p) return "/";
  let s = p.trim().replace(/\\/g, "/");
  if (!s.startsWith("/")) s = "/" + s;
  if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1);
  return s;
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const [currentFolder, setCurrentFolder] = useState("/");
  const [folders, setFolders] = useState<FolderRow[]>([]);
  const [files, setFiles] = useState<FileRow[]>([]);
  const [listLoading, setListLoading] = useState(false);

  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [currentPage, setCurrentPage] = useState(1);

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [newFolderName, setNewFolderName] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [movingId, setMovingId] = useState<string | null>(null);
  const [moveValue, setMoveValue] = useState("");

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Drag & Drop
  const [isDragging, setIsDragging] = useState(false);

  // Helpers
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (iso: string) => {
    if (!iso || iso === "0" || new Date(iso).getTime() === 0) return "Implicit";
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const refresh = useCallback(async (path = currentFolder, page = currentPage) => {
    if (status !== "authenticated") return;
    setListLoading(true);
    try {
      const searchEncoded = encodeURIComponent(debouncedSearch);

      // Fetch Folders
      const fRes = await fetch(`/api/folders?parent=${encodeURIComponent(path)}&search=${searchEncoded}`);
      if (fRes.ok) {
        const data = await fRes.json();
        if (data.ok) setFolders(data.folders);
      } else if (fRes.status === 401) {
        signOut({ redirect: false });
      }

      // Fetch Files
      const res = await fetch(`/api/files?folder=${encodeURIComponent(path)}&search=${searchEncoded}&page=${page}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        if (data.ok) {
          setFiles(data.files);
          setPagination(data.pagination);
        }
      }
    } catch (e) {
      console.error("Refresh error", e);
    } finally {
      setListLoading(false);
    }
  }, [currentFolder, currentPage, debouncedSearch, status]);

  useEffect(() => {
    refresh(currentFolder, currentPage);
  }, [currentFolder, debouncedSearch, currentPage, refresh]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGlobalError("");

    if (isRegistering) {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailInput, password: passwordInput }),
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          // Now sign in
          const authRes = await signIn("credentials", {
            email: emailInput,
            password: passwordInput,
            redirect: false,
          });
          if (authRes?.error) setGlobalError(authRes.error);
        } else {
          setGlobalError(data.error || "Registration failed");
        }
      } catch {
        setGlobalError("Connection error");
      }
    } else {
      const authRes = await signIn("credentials", {
        email: emailInput,
        password: passwordInput,
        redirect: false,
      });
      if (authRes?.error) {
        setGlobalError(authRes.error === "CredentialsSignin" ? "Invalid email or password" : authRes.error);
      }
    }
    setLoading(false);
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentPath: currentFolder, name: newFolderName }),
      });
      if ((await res.json()).ok) {
        setNewFolderName("");
        refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    if (!file) return;
    setLoading(true);
    setUploadProgress(0);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folderPath", currentFolder);

    try {
      // In a real app, use XMLHttpRequest or a library with progress support for real progress
      // Mocking progress for UX
      const interval = setInterval(() => {
        setUploadProgress(p => p !== null && p < 90 ? p + 10 : p);
      }, 200);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      clearInterval(interval);
      setUploadProgress(100);

      const data = await res.json();
      if (data.ok) {
        setTimeout(() => setUploadProgress(null), 1000);
        refresh();
      } else {
        setGlobalError(data.error || "Upload failed");
        setUploadProgress(null);
      }
    } catch {
      setGlobalError("Upload connection error");
      setUploadProgress(null);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (type: "file" | "folder", idOrPath: string) => {
    if (!confirm(`Delete this ${type}?`)) return;
    setLoading(true);
    try {
      const url = type === "file" ? `/api/files/${idOrPath}` : `/api/folders?path=${encodeURIComponent(idOrPath)}`;
      const res = await fetch(url, { method: "DELETE" });
      if ((await res.json()).ok) refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async (id: string) => {
    if (!renameValue.trim()) {
      setRenamingId(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/files/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newName: renameValue })
      });
      if ((await res.json()).ok) {
        setRenamingId(null);
        refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (id: string, path: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/files/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newFolderPath: normalizePath(path) })
      });
      if ((await res.json()).ok) {
        setMovingId(null);
        refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const crumbs = useMemo(() => {
    const p = normalizePath(currentFolder);
    const out = [{ name: "Cloud", path: "/" }];
    if (p === "/") return out;
    let acc = "";
    p.split("/").filter(Boolean).forEach(part => {
      acc += "/" + part;
      out.push({ name: part, path: acc });
    });
    return out;
  }, [currentFolder]);

  // Drag and Drop Effects
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen text-slate-400 font-medium">Authenticating...</div>;

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="glass-card p-10 w-full max-w-md animate-fade-in shadow-2xl">
          <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            VaultDrive
          </h1>
          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
              <input type="email" required value={emailInput} onChange={e => setEmailInput(e.target.value)} className="w-full bg-slate-900/50 border-slate-700/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
              <input type="password" required minLength={6} value={passwordInput} onChange={e => setPasswordInput(e.target.value)} className="w-full bg-slate-900/50 border-slate-700/50" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/20">
              {loading ? "Authenticating..." : (isRegistering ? "Create Account" : "Sign In")}
            </button>
            <p className="text-center text-sm text-slate-500 mt-6">
              <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="text-blue-400 hover:underline">
                {isRegistering ? "Back to Login" : "Don't have an account? Sign Up"}
              </button>
            </p>
            {globalError && <div className="text-red-400 text-center text-sm mt-4 p-3 bg-red-400/10 rounded-lg">{globalError}</div>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/40 backdrop-blur-xl border-r border-white/5 p-6 flex flex-col gap-8 hidden lg:flex">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent px-2">
          VaultDrive
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => setCurrentFolder("/")} className="w-full text-left px-4 py-3 rounded-xl bg-blue-600/10 text-blue-400 font-medium">
            📂 All Files
          </button>
          <button disabled className="w-full text-left px-4 py-3 rounded-xl text-slate-500 cursor-not-allowed">
            ⭐️ Starred
          </button>
          <button disabled className="w-full text-left px-4 py-3 rounded-xl text-slate-500 cursor-not-allowed">
            🗑️ Trash
          </button>
        </nav>

        <div className="glass-card p-4 space-y-3">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Storage Used</div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[15%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          </div>
          <div className="text-[10px] text-slate-400">1.2 GB of 25 GB used</div>
        </div>

        <button onClick={() => signOut()} className="px-4 py-2 text-sm text-slate-500 hover:text-white transition-colors">
          Logout Session
        </button>
      </aside>

      {/* Main Content */}
      <main
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`flex-1 flex flex-col h-screen overflow-hidden transition-colors ${isDragging ? "bg-blue-500/5 ring-2 ring-blue-500/20 inset-0" : ""}`}
      >
        {/* Header */}
        <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-slate-900/20 backdrop-blur-md relative">
          {listLoading && <div className="absolute bottom-0 left-0 h-[2px] bg-blue-500 animate-pulse w-full" />}

          <div className="flex items-center gap-4 text-sm font-medium">
            {crumbs.map((c, i) => (
              <span key={c.path} className="flex items-center gap-3">
                {i > 0 && <span className="text-slate-600">/</span>}
                <button onClick={() => { setCurrentFolder(c.path); setCurrentPage(1); }} className={i === crumbs.length - 1 ? "text-slate-200" : "text-slate-500 hover:text-slate-300 transition-colors"}>
                  {c.name}
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="relative w-80">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
              <input type="text" placeholder="Search your vault..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 h-10 bg-white/5 border-white/10 text-sm" />
            </div>
            <div className="flex gap-3">
              <label className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg cursor-pointer transition-all shadow-lg shadow-blue-500/10 text-sm font-medium">
                <span>{uploadProgress !== null ? `Uploading ${uploadProgress}%` : "Upload"}</span>
                <input type="file" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadFile(file);
                }} />
              </label>
              <button onClick={() => { const n = prompt("Folder name:"); if (n) { setNewFolderName(n); createFolder(); } }} className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all text-sm font-medium">
                Folder+
              </button>
            </div>
          </div>
        </header>

        {/* Browser */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          {globalError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between animate-fade-in">
              <span className="text-red-400 text-sm font-medium">⚠️ {globalError}</span>
              <button onClick={() => setGlobalError("")} className="text-red-400/50 hover:text-red-400">&times;</button>
            </div>
          )}

          {/* Folders Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-200 tracking-tight">Folders</h2>
              <span className="text-xs text-slate-500 font-medium">{folders.length} items</span>
            </div>
            {folders.length === 0 ? (
              <div className="h-24 flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl text-slate-600 italic">No sub-folders here</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {folders.map(f => (
                  <div key={f.id} className="glass-card group p-5 hover:bg-white/5 transition-all cursor-pointer relative">
                    <div onClick={() => setCurrentFolder(f.path)} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📁</div>
                      <div>
                        <div className="font-semibold text-slate-200 truncate max-w-[120px]">{f.name}</div>
                        <div className="text-xs text-slate-500">{formatDate(f.createdAt)}</div>
                      </div>
                    </div>
                    <button onClick={() => deleteItem("folder", f.path)} className="absolute top-2 right-2 p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Files Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-6">
                <h2 className="text-lg font-bold text-slate-200 tracking-tight">Recent Files</h2>
                <div className="flex items-center gap-2 p-1 bg-white/5 rounded-lg border border-white/5">
                  <button className="px-3 py-1 bg-blue-600 rounded-md text-xs font-semibold">List</button>
                  <button disabled className="px-3 py-1 text-slate-500 text-xs">Grid</button>
                </div>
              </div>
              <span className="text-xs text-slate-500 font-medium">Page {currentPage} of {pagination.totalPages}</span>
            </div>

            <div className="glass-card overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 font-semibold bg-white/5">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Size</th>
                    <th className="px-6 py-4">Created</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {files.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-20 text-center text-slate-600 italic">This folder is empty</td></tr>
                  ) : (
                    files.map(f => (
                      <tr key={f.id} className="hover:bg-white/[0.02] group transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <span className="text-xl">📄</span>
                            <div className="flex flex-col">
                              {renamingId === f.id ? (
                                <input autoFocus value={renameValue} onChange={e => setRenameValue(e.target.value)} onBlur={() => handleRename(f.id)} className="bg-slate-900 border-indigo-500 h-8" />
                              ) : (
                                <a href={`/api/preview/${f.id}`} target="_blank" className="font-semibold text-slate-200 hover:text-blue-400 transition-colors">{f.originalName}</a>
                              )}
                              <span className="text-[10px] text-slate-600 font-mono tracking-tighter uppercase">{f.mimeType.split("/")[1] || "File"}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400">{formatSize(f.sizeBytes)}</td>
                        <td className="px-6 py-4 text-slate-400">{formatDate(f.createdAt)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {movingId === f.id ? (
                              <div className="flex items-center gap-2">
                                <input autoFocus placeholder="Target path..." value={moveValue} onChange={e => setMoveValue(e.target.value)} className="bg-slate-900 border-indigo-500 h-8 text-xs w-32" />
                                <button onClick={() => handleMove(f.id, moveValue)} className="text-blue-400 text-xs hover:underline">Go</button>
                                <button onClick={() => setMovingId(null)} className="text-slate-500 text-xs hover:underline">X</button>
                              </div>
                            ) : (
                              <>
                                <a href={`/api/download/${f.id}`} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white" title="Download">⬇️</a>
                                <button onClick={() => { setMovingId(f.id); setMoveValue(f.folderPath); }} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white" title="Move">🚚</button>
                                <button onClick={() => { setRenamingId(f.id); setRenameValue(f.originalName); }} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white" title="Rename">✏️</button>
                                <button onClick={() => deleteItem("file", f.id)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-red-400" title="Delete">🗑️</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-2 bg-slate-800 disabled:opacity-30 rounded-lg text-sm transition-all hover:bg-slate-700">Previous</button>
                <div className="flex gap-2">
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button disabled={currentPage === pagination.totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-2 bg-slate-800 disabled:opacity-30 rounded-lg text-sm transition-all hover:bg-slate-700">Next</button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
