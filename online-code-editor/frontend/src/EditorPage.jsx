// src/EditorPage.jsx
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { saveSnippet, fetchSnippets } from "./api";
import io from "socket.io-client";
import hljs from "highlight.js/lib/common";
import { useAuth } from "./context/AuthContext.jsx";

const socket = io("http://localhost:5000");

const HLJS_TO_MONACO = {
  javascript: "javascript",
  python: "python",
  cpp: "cpp",
  // ... keep your mapping here
};

export default function EditorPage() {
  const { user, setGuestUser, logout } = useAuth();
  const [code, setCode] = useState("// Start coding...");
  const [title, setTitle] = useState("");
  const [snippets, setSnippets] = useState([]);
  const [language, setLanguage] = useState("javascript");
  const [activeSnippet, setActiveSnippet] = useState(null);

  useEffect(() => {
    if (!user) setGuestUser();
  }, [user, setGuestUser]);

  useEffect(() => {
    fetchSnippets().then(setSnippets);
  }, []);

  useEffect(() => {
    const handler = (data) => {
      setCode(data);
      autoDetectLanguage(data);
    };
    socket.on("codeUpdate", handler);
    return () => socket.off("codeUpdate", handler);
  }, []);

  const autoDetectLanguage = (text) => {
    const { language: hlName } = hljs.highlightAuto((text || "").trim());
    setLanguage(HLJS_TO_MONACO[hlName] || "plaintext");
  };

  const handleCodeChange = (value) => {
    const next = value ?? "";
    setCode(next);
    autoDetectLanguage(next);
    socket.emit("codeChange", next);
  };

  const handleSave = async () => {
    const snippet = { title, language, code };
    const result = await saveSnippet(snippet);
    alert(result.message || "Snippet saved!");
    setSnippets((prev) => [...prev, snippet]);
    setActiveSnippet(snippet.title);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#1e1e1e", color: "#ddd" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", borderRight: "1px solid #333", padding: "12px", overflowY: "auto", background: "#252526" }}>
        <h3 style={{ marginBottom: "10px", color: "#61dafb" }}>Saved Snippets</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {snippets.map((s, index) => (
            <li key={index} onClick={() => setCode(s.code)} style={{ cursor: "pointer", padding: "8px" }}>
              <strong>{s.title}</strong> <br />
              <small>({s.language})</small>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Editor */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "10px", borderBottom: "1px solid #333", display: "flex", alignItems: "center", gap: "10px", background: "#2d2d2d" }}>
          <h2 style={{ flex: 1, margin: 0, color: "#61dafb" }}>Collaborative Code Editor</h2>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Snippet Title" />
          {!user.guest && <button onClick={logout}>Logout</button>}
          <button onClick={handleSave}>Save</button>
        </div>

        <Editor language={language} theme="vs-dark" value={code} onChange={handleCodeChange} options={{ fontSize: 16, minimap: { enabled: false } }} />
      </div>
    </div>
  );
}
