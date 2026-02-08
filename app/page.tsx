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
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

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
    setFolders([]);
    setFiles([]);
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
        console.log("Registering with:", { email: emailInput, password: passwordInput });
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
      <main className="min-h-screen bg-[#0B0F14] relative overflow-hidden font-sans p-4 md:p-6 lg:p-8 selection:bg-emerald-500/30 text-[#E5E7EB]">
        <div className="flex items-center justify-center min-h-[90vh] relative z-20">
          {/* Dynamic Mesh Background */}
          <div className="mesh-gradient opacity-40">
            <div className="mesh-ball w-[800px] h-[800px] bg-emerald-600/10 -top-40 -left-40 animate-mesh-move" />
            <div className="mesh-ball w-[600px] h-[600px] bg-indigo-600/10 bottom-0 right-0 animate-mesh-move [animation-delay:-5s]" />
          </div>

          <div className="glass-card p-8 w-full max-w-[420px] animate-slide-up shadow-2xl relative z-10 border-white/[0.08] flex flex-col items-center">
            <div className="flex flex-col items-center mb-6 group">
              <div className="w-16 h-16 bg-emerald-600 rounded-lg flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10 group-hover:scale-105 transition-all duration-500">
                <span className="text-3xl text-white">☁️</span>
              </div>
              <h1 className="text-2xl font-bold text-[#E5E7EB] mb-2 leading-tight text-center">VaultDrive</h1>
              <p className="text-[#9CA3AF] tracking-[0.2em] uppercase text-[9px] font-semibold text-center">Digital Fortress v2.0</p>
            </div>

            <form onSubmit={handleAuth} className="w-full space-y-5">
              <div className="flex flex-col">
                <label>Access Identity</label>
                <input
                  type="email"
                  required
                  placeholder="operator@vault.io"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  className="premium-input w-full"
                />
              </div>
              <div className="flex flex-col">
                <label>Security Protocol</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  minLength={6}
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  className="premium-input w-full"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: '#22C55E' }}
                className="w-full h-11 text-white text-sm font-bold shadow-lg shadow-emerald-500/10 rounded-[6px] mt-2 hover:bg-[#16A34A] transition-colors"
              >
                {loading ? "Decrypting..." : (isRegistering ? "Initialize Node" : "Access Vault")}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.05]"></div></div>
                <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-[0.3em] text-[#6B7280]"><span className="bg-[#111827] px-4">Gateway</span></div>
              </div>

              <button
                type="button"
                onClick={() => { setIsRegistering(!isRegistering); setGlobalError(""); }}
                className="w-full h-11 text-xs font-semibold text-[#9CA3AF] hover:text-[#E5E7EB] transition-all bg-white/5 rounded-[6px]"
              >
                {isRegistering ? "Switch to Secure Login" : "Initialize New Cluster"}
              </button>

              {globalError && (
                <div className="text-red-400 text-center text-sm mt-6 p-4 bg-red-400/5 rounded-lg border border-red-400/10 animate-pulse-soft">
                  {globalError}
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0B0F14] relative p-4 md:p-6 lg:p-8 text-[#E5E7EB]">
      <div className="mesh-gradient">
        <div className="mesh-ball w-[1000px] h-[1000px] bg-emerald-600/5 -top-40 -left-40 animate-mesh-move" />
        <div className="mesh-ball w-[800px] h-[800px] bg-indigo-600/5 bottom-0 right-0 animate-mesh-move [animation-delay:-7s]" />
      </div>

      {/* Sidebar */}
      <aside className="w-[var(--sidebar-w)] h-[calc(100vh-4rem)] sticky top-8 bg-[#111827]/80 backdrop-blur-3xl border border-white/10 rounded-lg p-6 flex flex-col hidden lg:flex relative z-20 shrink-0 shadow-2xl">
        <div className="flex items-center gap-4 px-2 mb-10 group cursor-pointer" onClick={() => setCurrentFolder("/")}>
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-500">☁️</div>
          <span className="text-xl font-bold text-white tracking-tight">VaultDrive</span>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
          <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.3em] mb-4 px-4">System Nodes</div>
          <button
            onClick={() => { setCurrentFolder("/"); setCurrentPage(1); }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${currentFolder === "/" ? "bg-white/[0.04] text-white ring-1 ring-white/10" : "text-[#9CA3AF] hover:text-white hover:bg-white/[0.01]"}`}
          >
            <span className={`text-xl ${currentFolder === "/" ? "opacity-100" : "opacity-30"}`}>📂</span>
            <span className="text-[12px] font-semibold tracking-wide">Primary Drive</span>
            {currentFolder === "/" && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(34,197,94,1)]"></div>}
          </button>
          <button
            onClick={() => { setCurrentFolder("/favorites"); setCurrentPage(1); }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${currentFolder === "/favorites" ? "bg-white/[0.04] text-white ring-1 ring-white/10" : "text-[#9CA3AF] hover:text-white hover:bg-white/[0.01]"}`}
          >
            <span className={`text-xl ${currentFolder === "/favorites" ? "opacity-100" : "opacity-30"}`}>⭐️</span>
            <span className="text-[12px] font-semibold tracking-wide">Priority Sync</span>
            {currentFolder === "/favorites" && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(34,197,94,1)]"></div>}
          </button>
          <button
            onClick={() => { setCurrentFolder("/trash"); setCurrentPage(1); }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${currentFolder === "/trash" ? "bg-white/[0.04] text-white ring-1 ring-white/10" : "text-[#9CA3AF] hover:text-white hover:bg-white/[0.01]"}`}
          >
            <span className={`text-xl ${currentFolder === "/trash" ? "opacity-100" : "opacity-30"}`}>🗑️</span>
            <span className="text-[12px] font-semibold tracking-wide">Recycle Bin</span>
            {currentFolder === "/trash" && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(34,197,94,1)]"></div>}
          </button>
        </nav>

        {/* Sidebar Footer - Enterprise Restore */}
        <div className="mt-auto pt-10 border-t border-white/10 flex flex-col gap-8">
          <div className="glass-card p-6 bg-white/[0.02] border border-white/5 rounded-lg relative group shadow-inner">
            <div className="text-[11px] text-[#E5E7EB] font-bold mb-4 flex justify-between items-center tracking-[0.2em] uppercase">
              <span className="flex items-center gap-2 opacity-60">📊 SECURE LOAD</span>
              <span className="text-emerald-400 font-mono tracking-normal">{formatSize(files.reduce((acc, f) => acc + f.sizeBytes, 0))}</span>
            </div>
            <div className="h-2 bg-slate-950 rounded-full overflow-hidden mb-4 border border-white/5 p-[1px]">
              <div
                className="h-full bg-emerald-600 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.8)] transition-all duration-1000"
                style={{ width: `${Math.min(100, (files.reduce((acc, f) => acc + f.sizeBytes, 0) / (25 * 1024 * 1024 * 1024)) * 100)}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-[#6B7280] font-bold uppercase tracking-[0.2em] flex justify-between px-1">
              <span>BUFFER</span>
              <span>25.0 GB</span>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-4 h-11 text-[11px] font-bold text-[#E5E7EB] hover:text-white transition-all border border-white/10 rounded-[6px] bg-white/5 hover:bg-rose-600 hover:border-rose-500 group"
          >
            <span className="group-hover:rotate-12 transition-transform text-lg">🔌</span>
            <span className="tracking-[0.3em] uppercase">Terminate</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`flex-1 flex flex-col h-screen overflow-hidden transition-colors ${isDragging ? "bg-emerald-500/5 ring-2 ring-emerald-500/20" : ""}`}
      >
        <div className="flex-1 flex flex-col min-w-0 lg:ml-8">
          <header className="h-[var(--header-h)] sticky top-0 z-30 border-b border-white/10 px-6 md:px-8 flex items-center justify-between bg-[#111827]/80 backdrop-blur-3xl shrink-0 rounded-t-lg shadow-2xl relative overflow-hidden">
            {listLoading && <div className="absolute bottom-0 left-0 h-[2px] bg-emerald-600 animate-prismatic w-full shadow-[0_0_20px_rgba(34,197,94,0.8)]" />}

            <div className="flex items-center gap-8 overflow-hidden max-w-[50%]">
              <div className="lg:hidden w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-xl shadow-lg shrink-0">☁️</div>
              <div className="flex items-center gap-4 text-[11px] font-semibold whitespace-nowrap overflow-x-auto no-scrollbar py-2">
                {crumbs.map((c, i) => (
                  <div key={c.path} className="flex items-center gap-3 shrink-0">
                    {i > 0 && <span className="text-white/5 mx-2">/</span>}
                    <button
                      onClick={() => { setCurrentFolder(c.path); setCurrentPage(1); }}
                      className={`transition-all px-3 py-1.5 rounded-lg flex items-center gap-2 ${i === crumbs.length - 1 ? "text-white bg-white/[0.04] border border-white/10" : "text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-white/[0.01]"}`}
                    >
                      {i === 0 && <span className="text-base opacity-30">🏠</span>}
                      <span className="tracking-wide text-xs">{c.name === "Cloud" ? "Home" : c.name}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-8 ml-auto">
              <div className="relative group hidden xl:block w-80">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#6B7280] group-focus-within:text-emerald-500 transition-all pointer-events-none text-sm z-10">🔍</span>
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="premium-input w-full pl-12"
                />
              </div>

              <div className="flex gap-4 items-center">
                <label
                  className="btn-primary"
                  style={{ width: '170px', height: '44px' }}
                >
                  <span className="text-lg">⚡</span>
                  <span className="flex-1 text-center text-xs font-bold leading-none">{uploadProgress !== null ? `${uploadProgress}%` : "Upload File"}</span>
                  <input type="file" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadFile(file);
                  }} />
                </label>

                <button
                  onClick={() => { const n = prompt("New folder name:"); if (n) { setNewFolderName(n); createFolder(); } }}
                  className="btn-secondary"
                  style={{ width: '170px', height: '44px' }}
                >
                  <span className="text-lg text-emerald-500">📂</span>
                  <span className="flex-1 text-center text-xs font-bold leading-none">New Folder</span>
                </button>
              </div>
            </div>
          </header>

          {/* Action Bar / Metadata Section */}
          <section className="px-6 md:px-8 py-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-6 bg-emerald-600 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.6)]"></div>
              <h2 className="text-xl font-bold text-[#E5E7EB] leading-tight">{currentFolder === "/" ? "Primary Node" : currentFolder.split("/").pop()}</h2>
              <div className="h-4 w-px bg-white/10 mx-2"></div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6B7280]">Sector Alpha-9</span>
            </div>

            <div className="flex bg-[#0F172A] p-1 rounded-lg border border-white/5">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-[6px] text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white/5 text-white shadow-lg' : 'text-[#9CA3AF] hover:text-[#E5E7EB]'}`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-[6px] text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-white/5 text-white shadow-lg' : 'text-[#9CA3AF] hover:text-[#E5E7EB]'}`}
              >
                Grid View
              </button>
            </div>
          </section>

          {/* Data View Section */}
          <section className="flex-1 px-4 md:px-6 lg:px-8 pb-8 overflow-y-auto no-scrollbar">
            {globalError && (
              <div className="mb-8 p-4 bg-rose-500/10 border border-white/5 rounded-lg flex items-center justify-between animate-fade-in relative z-10">
                <span className="text-rose-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="text-base">⚠️</span> {globalError}
                </span>
                <button onClick={() => setGlobalError("")} className="w-8 h-8 flex items-center justify-center text-rose-400/50 hover:text-rose-400 transition-colors">&times;</button>
              </div>
            )}

            {/* Folders Section */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {currentFolder !== "/" && (
                    <button
                      onClick={() => {
                        const parts = currentFolder.split("/").filter(Boolean);
                        parts.pop();
                        setCurrentFolder("/" + parts.join("/"));
                        setCurrentPage(1);
                      }}
                      className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-emerald-600/10 rounded-lg border border-white/10 text-[#9CA3AF] hover:text-emerald-400 transition-all mr-2 group/back"
                    >
                      <span className="group-hover/back:-translate-x-0.5 transition-transform text-xs">←</span>
                    </button>
                  )}
                  <h2 className="text-lg font-bold text-white leading-tight font-heading">
                    {currentFolder === "/" ? "Primary Repositories" : currentFolder === "/favorites" ? "Pinned Assets" : currentFolder === "/trash" ? "Deprioritized" : "Nested Clusters"}
                  </h2>
                </div>
                <span className="text-[10px] font-bold text-white opacity-20 uppercase tracking-widest">
                  {folders.length} Nodes
                </span>
              </div>

              {folders.length === 0 ? (
                <div className="h-24 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-lg bg-white/[0.01] text-[#6B7280]">
                  <p className="text-[#6B7280] font-bold uppercase tracking-widest text-[9px]">Sector Buffer Clear</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {folders.map(f => (
                    <div
                      key={f.id}
                      onClick={() => setCurrentFolder(f.path)}
                      className="glass-card group p-5 hover:bg-white/[0.04] transition-all cursor-pointer relative overflow-hidden border-white/5 rounded-lg"
                    >
                      <div className="flex items-center gap-4 relative z-10 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center text-xl group-hover:scale-110 transition-all border border-white/10 shrink-0">
                          📂
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                          <div className="font-bold text-[#E5E7EB] truncate text-xs uppercase tracking-wider">{f.name}</div>
                          <div className="text-[9px] font-medium text-[#9CA3AF] uppercase tracking-widest">{formatDate(f.createdAt)}</div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteItem("folder", f.path); }}
                          className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-rose-400 rounded-lg transition-all"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Files Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-[#E5E7EB] leading-tight font-heading">
                    {currentFolder === "/" ? "Data Objects" : "Sector Data"}
                  </h2>
                </div>
                <div className="flex bg-[#0F172A] p-1 rounded-lg border border-white/5">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1.5 rounded-[6px] text-[9px] font-bold uppercase tracking-widest transition-all ${viewMode === "list" ? "bg-white/5 text-white shadow-lg" : "text-[#6B7280] hover:text-[#E5E7EB]"}`}
                  >
                    List
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-1.5 rounded-[6px] text-[9px] font-bold uppercase tracking-widest transition-all ${viewMode === "grid" ? "bg-white/5 text-white shadow-lg" : "text-[#6B7280] hover:text-[#E5E7EB]"}`}
                  >
                    Grid
                  </button>
                </div>
              </div>

              {/* Mobile File View */}
              <div className="md:hidden space-y-4">
                {files.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-lg bg-white/[0.01]">
                    <p className="text-[#6B7280] font-bold uppercase tracking-widest text-[9px]">No data packets detected</p>
                  </div>
                ) : (
                  files.map(f => (
                    <div key={f.id} className="glass-card p-4 space-y-4 rounded-lg border-white/5 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl border border-white/5">
                          {f.mimeType.startsWith('image/') ? '🖼️' : f.mimeType.includes('pdf') ? '📄' : '📦'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-[#E5E7EB] truncate text-xs">{f.originalName}</div>
                          <div className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-widest mt-0.5">{formatSize(f.sizeBytes)} • {formatDate(f.createdAt)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-4 border-t border-white/[0.03]">
                        <a href={`/api/download/${f.id}`} className="flex-1 h-10 flex items-center justify-center bg-emerald-600/10 text-emerald-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-emerald-500/10">Download</a>
                        <button onClick={() => deleteItem("file", f.id)} className="w-10 h-10 flex items-center justify-center bg-rose-500/5 text-rose-400 rounded-lg border border-rose-500/10">🗑️</button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {files.length === 0 ? (
                      <div className="col-span-full h-48 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-lg bg-white/[0.01]">
                        <p className="text-[#6B7280] font-bold uppercase tracking-widest text-[9px]">Sector Buffer Clear</p>
                      </div>
                    ) : (
                      files.map(f => (
                        <div key={f.id} className="glass-card group p-6 hover:bg-white/[0.03] transition-all cursor-pointer relative overflow-hidden border-white/5 shadow-xl flex flex-col items-center text-center gap-5 rounded-lg">
                          <div className="w-12 h-12 rounded-lg bg-white/[0.02] flex items-center justify-center text-2xl group-hover:scale-105 transition-all duration-500 border border-white/[0.05]">
                            {f.mimeType.startsWith('image/') ? '🖼️' : f.mimeType.includes('pdf') ? '📄' : '📦'}
                          </div>
                          <div className="flex flex-col gap-1 min-w-0 w-full">
                            <a href={`/api/preview/${f.id}`} target="_blank" className="font-bold text-[#E5E7EB] hover:text-emerald-400 transition-colors truncate w-full block text-xs">
                              {f.originalName}
                            </a>
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-[10px] text-[#9CA3AF] font-medium">{formatSize(f.sizeBytes)}</span>
                              <span className="text-[10px] text-white opacity-10">•</span>
                              <span className="text-[10px] text-[#9CA3AF] font-medium uppercase">{f.mimeType.split("/")[1]?.toUpperCase() || "DATA"}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pt-4 border-t border-white/[0.03] w-full justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                            <a href={`/api/download/${f.id}`} className="w-8 h-8 flex items-center justify-center bg-white/5 text-[#9CA3AF] rounded-[6px] hover:bg-emerald-600 hover:text-white transition-all" title="Download">⬇️</a>
                            <button onClick={() => deleteItem("file", f.id)} className="w-8 h-8 flex items-center justify-center bg-white/5 text-[#9CA3AF] rounded-[6px] hover:bg-rose-600 hover:text-white transition-all" title="Purge">🗑️</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="glass-card overflow-hidden border-white/[0.05] rounded-lg shadow-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="text-[#6B7280] font-bold text-[10px] uppercase tracking-[0.2em] border-b border-white/[0.03]">
                          <th className="pl-6 pr-4 py-5">Resource Name</th>
                          <th className="px-4 py-5">Size</th>
                          <th className="px-4 py-5 text-center">Status</th>
                          <th className="pr-6 pl-4 py-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.03]">
                        {files.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-20 text-center text-[#6B7280]">
                              <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Sector Buffer Empty</p>
                            </td>
                          </tr>
                        ) : (
                          files.map(f => (
                            <tr key={f.id} className="hover:bg-white/[0.01] group transition-all border-b border-white/[0.02] last:border-b-0">
                              <td className="pl-6 pr-4 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-lg bg-white/[0.02] flex items-center justify-center text-xl border border-white/[0.03]">
                                    {f.mimeType.startsWith('image/') ? '🖼️' : f.mimeType.includes('pdf') ? '📄' : '📦'}
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    {renamingId === f.id ? (
                                      <input
                                        autoFocus
                                        value={renameValue}
                                        onChange={e => setRenameValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleRename(f.id)}
                                        onBlur={() => handleRename(f.id)}
                                        className="bg-[#0F172A] border border-white/10 h-8 text-xs font-medium px-3 rounded-[6px] outline-none w-64 focus:border-emerald-500/50"
                                      />
                                    ) : (
                                      <a href={`/api/preview/${f.id}`} target="_blank" className="font-bold text-[#E5E7EB] hover:text-emerald-400 transition-colors truncate max-w-sm block text-xs">
                                        {f.originalName}
                                      </a>
                                    )}
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-widest">{f.mimeType.split("/")[1] || "Data"}</span>
                                      <span className="text-[9px] text-white opacity-5">•</span>
                                      <span className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-widest">{formatDate(f.createdAt)}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-[11px] text-[#9CA3AF] font-semibold">{formatSize(f.sizeBytes)}</td>
                              <td className="px-4 py-4 text-center">
                                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Secure</span>
                              </td>
                              <td className="pr-6 pl-4 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                  <a href={`/api/download/${f.id}`} className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-[6px] text-[#6B7280] hover:text-white transition-all">⬇️</a>
                                  <button onClick={() => deleteItem("file", f.id)} className="w-8 h-8 flex items-center justify-center hover:bg-rose-500/10 rounded-[6px] text-[#6B7280] hover:text-rose-400 transition-all">🗑️</button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-6 pb-20">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="px-6 py-3 bg-white/[0.03] border border-white/5 disabled:opacity-10 rounded-[6px] text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-white/[0.06] text-[#9CA3AF]"
                  >
                    Prev
                  </button>
                  <div className="flex gap-2 p-1.5 bg-white/[0.02] rounded-lg border border-white/5 hidden sm:flex">
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-9 h-9 rounded-[6px] text-[10px] font-bold transition-all ${currentPage === i + 1 ? "bg-emerald-600 text-white shadow-lg" : "text-[#6B7280] hover:bg-white/5"}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={currentPage === pagination.totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="px-6 py-3 bg-white/[0.03] border border-white/5 disabled:opacity-10 rounded-[6px] text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-white/[0.06] text-[#9CA3AF]"
                  >
                    Next
                  </button>
                </div>
              )}
            </section>
          </section>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-8 left-8 right-8 h-20 bg-[#111827]/90 backdrop-blur-3xl border border-white/10 flex items-center justify-around px-6 z-50 shadow-2xl animate-slide-up rounded-[20px]">
        <button onClick={() => setCurrentFolder("/")} className="p-4 text-emerald-400 active:scale-75 transition-all">
          <span className="text-2xl">📁</span>
        </button>
        <label className="p-5 bg-emerald-600 rounded-full shadow-2xl shadow-emerald-500/40 -translate-y-10 border-[8px] border-[#0B0F14] cursor-pointer active:scale-75 hover:scale-105 transition-all">
          <span className="text-2xl text-white">⚡</span>
          <input type="file" className="hidden" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
          }} />
        </label>
        <button onClick={() => signOut()} className="p-4 text-[#6B7280] active:scale-75 transition-all">
          <span className="text-2xl">🔌</span>
        </button>
      </nav>
    </div >
  );
}
