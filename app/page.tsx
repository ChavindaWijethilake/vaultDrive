"use client";

import { useEffect, useState, useMemo } from "react";

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

function normalizePath(p: string) {
  if (!p) return "/";
  let s = p.trim().replace(/\\/g, "/");
  if (!s.startsWith("/")) s = "/" + s;
  if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1);
  return s;
}

function parentOf(path: string) {
  const p = normalizePath(path);
  if (p === "/") return "/";
  const idx = p.lastIndexOf("/");
  if (idx === 0) return "/";
  return p.slice(0, idx);
}

export default function HomePage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  // apiKeyInput removed
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const [currentFolder, setCurrentFolder] = useState("/");
  const [folders, setFolders] = useState<FolderRow[]>([]);
  const [files, setFiles] = useState<FileRow[]>([]);
  const [listLoading, setListLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [newFolderName, setNewFolderName] = useState("");

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Rename / Move state
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const [movingId, setMovingId] = useState<string | null>(null);
  const [moveValue, setMoveValue] = useState("");

  // Helpers
  function formatSize(bytes: number) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  function formatDate(iso: string) {
    if (!iso) return "";
    return new Date(iso).toLocaleString();
  }

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Check auth status
  async function checkAuth() {
    setLoading(true);
    try {
      const res = await fetch("/api/folders?parent=/");
      if (res.status === 401 || res.status === 403) {
        setAuthorized(false);
      } else if (res.ok) {
        setAuthorized(true);
        // Load initial data
        const data = await res.json();
        if (data.ok) setFolders(data.folders || []);
        fetchFiles("/", "");
      } else {
        setGlobalError("Failed to connect to server.");
      }
    } catch (e) {
      setGlobalError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  // Toggle between login and register
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setGlobalError("");
    const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setAuthorized(true);
        refresh("/");
      } else {
        setGlobalError(data.error || "Auth failed");
      }
    } catch (e) {
      setGlobalError("Auth error");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthorized(false);
    setFolders([]);
    setFiles([]);
    setEmailInput("");
    setPasswordInput("");
  }

  async function refresh(path = currentFolder) {
    setGlobalError("");
    setListLoading(true);
    const encoded = encodeURIComponent(path);
    const searchEncoded = encodeURIComponent(debouncedSearch);

    try {
      // Folders
      const fRes = await fetch(`/api/folders?parent=${encoded}`);
      if (fRes.ok) {
        const fData = await fRes.json();
        if (fData.ok) setFolders(fData.folders);
      }

      // Files
      await fetchFiles(path, debouncedSearch);
    } catch (e) {
      console.error("Refresh error", e);
    } finally {
      setListLoading(false);
    }
  }

  async function fetchFiles(path: string, search: string) {
    const encoded = encodeURIComponent(path);
    const searchEncoded = encodeURIComponent(search);
    const res = await fetch(`/api/files?folder=${encoded}&search=${searchEncoded}`);
    if (res.ok) {
      const data = await res.json();
      if (data.ok) setFiles(data.files);
    }
  }

  // Reload when folder or search changes
  useEffect(() => {
    if (authorized) {
      refresh(currentFolder);
    }
  }, [currentFolder, authorized, debouncedSearch]);

  async function createFolder() {
    if (!newFolderName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentPath: currentFolder, name: newFolderName }),
      });
      const data = await res.json();
      if (data.ok) {
        setNewFolderName("");
        refresh(currentFolder);
      } else {
        setGlobalError(data.error);
      }
    } finally {
      setLoading(false);
    }
  }

  async function uploadFile() {
    if (!file) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folderPath", currentFolder);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.ok) {
        setFile(null);
        refresh(currentFolder);
      } else {
        setGlobalError(data.error);
      }
    } finally {
      setLoading(false);
    }
  }

  async function deleteFile(id: string) {
    if (!confirm("Are you sure you want to delete this file?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/files/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        refresh(currentFolder);
      } else {
        setGlobalError(data.error);
      }
    } finally {
      setLoading(false);
    }
  }

  async function deleteFolder(path: string) {
    if (!confirm("Are you sure you want to delete this folder and all its contents?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/folders?path=${encodeURIComponent(path)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        refresh(currentFolder);
      } else {
        setGlobalError(data.error);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRename(id: string) {
    if (!renameValue.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/files/${id}/rename`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newName: renameValue })
      });
      const data = await res.json();
      if (data.ok) {
        setRenamingId(null);
        setRenameValue("");
        refresh(currentFolder);
      } else {
        setGlobalError(data.error);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleMove(id: string) {
    const target = normalizePath(moveValue);
    setLoading(true);
    try {
      const res = await fetch(`/api/files/${id}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderPath: target })
      });
      const data = await res.json();
      if (data.ok) {
        setMovingId(null);
        setMoveValue("");
        refresh(currentFolder);
      } else {
        setGlobalError(data.error);
      }
    } finally {
      setLoading(false);
    }
  }

  const crumbs = useMemo(() => {
    const p = normalizePath(currentFolder);
    if (p === "/") return [{ name: "Root", path: "/" }];
    const parts = p.split("/").filter(Boolean);
    const out: { name: string; path: string }[] = [{ name: "Root", path: "/" }];
    let acc = "";
    for (const part of parts) {
      acc += "/" + part;
      out.push({ name: part, path: acc });
    }
    return out;
  }, [currentFolder]);

  if (authorized === null) return <div style={{ padding: 20 }}>Checking session...</div>;

  if (!authorized) {
    return (
      <div style={{ padding: 40, maxWidth: 400, margin: "0 auto", fontFamily: "sans-serif" }}>
        <h1 style={{ textAlign: "center", marginBottom: 20 }}>{isRegistering ? "Register for VaultDrive" : "Login to VaultDrive"}</h1>
        <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          <label>
            Email:
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              style={{ width: "100%", padding: 10, marginTop: 4, borderRadius: 4, border: "1px solid #ccc" }}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              required
              minLength={6}
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={{ width: "100%", padding: 10, marginTop: 4, borderRadius: 4, border: "1px solid #ccc" }}
            />
          </label>
          <button type="submit" disabled={loading} style={{ padding: 12, cursor: "pointer", background: "#007bff", color: "white", border: "none", borderRadius: 4, fontWeight: "bold" }}>
            {loading ? (isRegistering ? "Registering..." : "Logging in...") : (isRegistering ? "Register" : "Login")}
          </button>

          <div style={{ textAlign: "center", marginTop: 10 }}>
            <button
              type="button"
              onClick={() => { setIsRegistering(!isRegistering); setGlobalError(""); }}
              style={{ background: "none", border: "none", color: "#007bff", textDecoration: "underline", cursor: "pointer" }}
            >
              {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
            </button>
          </div>

          {globalError && <div style={{ color: "red", marginTop: 10, textAlign: "center" }}>{globalError}</div>}
        </form>
      </div>
    );
  }

  return (
    <main style={{ padding: 20, fontFamily: "sans-serif", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>VaultDrive</h1>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid #ccc" }}
          />
          <button onClick={handleLogout} style={{ padding: "6px 12px", cursor: "pointer" }}>Logout</button>
        </div>
      </div>

      {globalError && (
        <div style={{ background: "#ffebee", color: "#c62828", padding: "10px 15px", borderRadius: 4, marginBottom: 15, border: "1px solid #ef9a9a" }}>
          <strong>Error:</strong> {globalError}
          <button onClick={() => setGlobalError("")} style={{ float: "right", border: "none", background: "none", cursor: "pointer", fontSize: 16 }}>&times;</button>
        </div>
      )}

      <div style={{ margin: "20px 0", background: "#f5f5f5", padding: 15, borderRadius: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 18, marginBottom: 10 }}>
          <strong>Location:</strong>
          {crumbs.map((c, i) => (
            <span key={c.path} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && <span style={{ margin: "0 5px", color: "#999" }}>/</span>}
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setCurrentFolder(c.path); }}
                style={{
                  color: i === crumbs.length - 1 ? "#333" : "#007bff",
                  textDecoration: i === crumbs.length - 1 ? "none" : "underline",
                  fontWeight: i === crumbs.length - 1 ? "bold" : "normal",
                  cursor: i === crumbs.length - 1 ? "default" : "pointer"
                }}
              >
                {c.name}
              </a>
            </span>
          ))}
        </div>

        {currentFolder !== "/" && (
          <button
            onClick={() => setCurrentFolder(parentOf(currentFolder))}
            style={{
              marginTop: 5,
              padding: "8px 16px",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 5
            }}
          >
            ⬅ Back to Parent
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ border: "1px solid #ccc", padding: 10, borderRadius: 4 }}>
          <h3>New Folder</h3>
          <input
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            placeholder="Folder Name"
            style={{ marginRight: 10 }}
          />
          <button onClick={createFolder} disabled={loading}>Create</button>
        </div>

        <div style={{ border: "1px solid #ccc", padding: 10, borderRadius: 4 }}>
          <h3>Upload File</h3>
          <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} style={{ marginRight: 10 }} />
          <button onClick={uploadFile} disabled={loading || !file}>Upload</button>
        </div>
      </div>

      <h2>Folders {listLoading && <span style={{ fontSize: "0.6em", color: "#666" }}>(Loading...)</span>}</h2>
      {folders.length === 0 ? <p style={{ color: "#777" }}>No folders</p> : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {folders.map(f => (
            <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid #006064", borderRadius: 4, background: "#e0f7fa", overflow: "hidden" }}>
              <button
                onClick={() => setCurrentFolder(f.path)}
                style={{
                  padding: "10px 15px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: "#006064"
                }}
              >
                📁 {f.name}
              </button>
              <button
                onClick={() => deleteFolder(f.path)}
                disabled={loading}
                style={{
                  padding: "10px",
                  border: "none",
                  borderLeft: "1px solid #006064",
                  background: "rgba(255,0,0,0.1)",
                  color: "#c62828",
                  cursor: "pointer"
                }}
                title="Delete Folder"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ marginTop: 30 }}>Files {listLoading && <span style={{ fontSize: "0.6em", color: "#666" }}>(Loading...)</span>}</h2>
      {files.length === 0 ? <p style={{ color: "#777" }}>No files</p> : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {files.map(f => (
            <li key={f.id} style={{ padding: "12px 10px", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, background: movingId === f.id ? "#fff3e0" : "transparent" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: "1.2em" }}>📄</span>
                  <a href={`/api/preview/${f.id}`} target="_blank" rel="noopener noreferrer" style={{ fontWeight: "bold", textDecoration: "none", color: "#007bff", fontSize: "1.05em" }}>
                    {f.originalName}
                  </a>
                </div>
                <span style={{ color: "#666", fontSize: "0.85em", marginTop: 4, marginLeft: 30 }}>
                  {formatSize(f.sizeBytes)} • {formatDate(f.createdAt)}
                </span>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {renamingId === f.id ? (
                  <>
                    <input value={renameValue} onChange={e => setRenameValue(e.target.value)} placeholder="New Name" style={{ padding: "6px 8px", borderRadius: 4, border: "1px solid #ccc" }} autoFocus />
                    <button onClick={() => handleRename(f.id)} disabled={loading} style={{ background: "#4caf50", color: "white", border: "none", padding: "6px 12px", borderRadius: 4, cursor: "pointer" }}>Save</button>
                    <button onClick={() => setRenamingId(null)} style={{ background: "#9e9e9e", color: "white", border: "none", padding: "6px 12px", borderRadius: 4, cursor: "pointer" }}>Cancel</button>
                  </>
                ) : movingId === f.id ? (
                  <>
                    <input value={moveValue} onChange={e => setMoveValue(e.target.value)} placeholder="/target/path" style={{ padding: "6px 8px", borderRadius: 4, border: "1px solid #ccc" }} autoFocus />
                    <button onClick={() => handleMove(f.id)} disabled={loading} style={{ background: "#2196f3", color: "white", border: "none", padding: "6px 12px", borderRadius: 4, cursor: "pointer" }}>Move</button>
                    <button onClick={() => setMovingId(null)} style={{ background: "#9e9e9e", color: "white", border: "none", padding: "6px 12px", borderRadius: 4, cursor: "pointer" }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <a href={`/api/preview/${f.id}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#333", border: "1px solid #ccc", padding: "5px 10px", borderRadius: 4, fontSize: "0.9em", background: "white" }}>Preview</a>
                    <a href={`/api/download/${f.id}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#333", border: "1px solid #ccc", padding: "5px 10px", borderRadius: 4, fontSize: "0.9em", background: "white" }}>Download</a>
                    <button onClick={() => { setRenamingId(f.id); setRenameValue(f.originalName); }} disabled={loading} style={{ cursor: "pointer", border: "1px solid #ccc", background: "white", padding: "5px 10px", borderRadius: 4 }}>Rename</button>
                    <button onClick={() => { setMovingId(f.id); setMoveValue(f.folderPath); }} disabled={loading} style={{ cursor: "pointer", border: "1px solid #ccc", background: "white", padding: "5px 10px", borderRadius: 4 }}>Move</button>
                    <button onClick={() => deleteFile(f.id)} disabled={loading} style={{ color: "white", background: "#f44336", border: "none", padding: "5px 10px", borderRadius: 4, cursor: "pointer" }}>Delete</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
