import "./style.css";
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { saveSnippet, fetchSnippets } from "./api";
import io from "socket.io-client";
import hljs from "highlight.js/lib/common";
import { useAuth } from "./context/AuthContext.jsx";
import LoginForm from "./auth-user/Login.jsx";
import RegisterForm from "./auth-user/Register.jsx";



const socket = io("http://localhost:5000");

const HLJS_TO_MONACO = {
  javascript: "javascript",
  typescript: "typescript",
  js: "javascript",
  ts: "typescript",
  python: "python",
  py: "python",
  java: "java",
  c: "c",
  "c++": "cpp",
  cpp: "cpp",
  csharp: "csharp",
  cs: "csharp",
  php: "php",
  ruby: "ruby",
  go: "go",
  rust: "rust",
  swift: "swift",
  kotlin: "kotlin",
  sql: "sql",
  json: "json",
  css: "css",
  scss: "scss",
  less: "less",
  html: "html",
  xml: "html",
  markdown: "markdown",
  bash: "shell",
  shell: "shell",
  sh: "shell",
  plaintext: "plaintext",
};

function App() {
  const { user, setGuestUser, logout } = useAuth();
  const [code, setCode] = useState("// Start coding...");
  const [title, setTitle] = useState("");
  const [snippets, setSnippets] = useState([]);
  const [language, setLanguage] = useState("javascript");
  const [activeSnippet, setActiveSnippet] = useState(null);

  // Auto-assign guest on first load
  useEffect(() => {
    if (!user) setGuestUser();
  }, [user, setGuestUser]);

  // Fetch saved snippets
  useEffect(() => {
    fetchSnippets().then(setSnippets);
  }, []);

  // Handle collaborative updates
  useEffect(() => {
    const handler = (data) => {
      setCode(data);
      autoDetectLanguage(data);
    };
    socket.on("codeUpdate", handler);
    return () => socket.off("codeUpdate", handler);
  }, []);

  const autoDetectLanguage = (text) => {
    const sample = (text || "").trim();
    if (sample.length < 2) return;
    const { language: hlName } = hljs.highlightAuto(sample);
    const monacoLang = HLJS_TO_MONACO[hlName] || "plaintext";
    setLanguage(monacoLang);
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

  const handleSnippetClick = (snippet) => {
    setCode(snippet.code);
    setLanguage(snippet.language);
    setTitle(snippet.title);
    setActiveSnippet(snippet.title);
  };

  // Show loading while guest is being assigned
  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#1e1e1e", color: "#ddd" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", borderRight: "1px solid #333", padding: "12px", overflowY: "auto", background: "#252526" }}>
        <h3 style={{ marginBottom: "10px", color: "#61dafb" }}>Saved Snippets</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {snippets.map((s, index) => (
            <li
              key={index}
              onClick={() => handleSnippetClick(s)}
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "6px",
                background: activeSnippet === s.title ? "#007acc" : "#2a2a2a",
                color: activeSnippet === s.title ? "#fff" : "#ddd",
                transition: "all 0.2s ease-in-out",
              }}
            >
              <strong>{s.title}</strong>
              <br />
              <small style={{ color: activeSnippet === s.title ? "#e0e0e0" : "#aaa" }}>({s.language})</small>
            </li>
          ))}
        </ul>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div
          style={{
            padding: "10px",
            borderBottom: "1px solid #333",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#2d2d2d",
          }}
        >
          <h2 style={{ margin: 0, flex: 1, color: "#61dafb" }}>Collaborative Code Editor</h2>
          <input
            type="text"
            placeholder="Snippet Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #555",
              background: "#1e1e1e",
              color: "#ddd",
            }}
          />
          <span
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid #555",
              fontSize: 12,
              background: "#3c3c3c",
              color: "#ddd",
            }}
          >
            {language}
          </span>
          {!user.guest && (
            <button
              onClick={logout}
              style={{
                padding: "6px 14px",
                background: "#d9534f",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Logout
            </button>
          )}
          <button
            onClick={handleSave}
            style={{
              padding: "6px 14px",
              background: "#007acc",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Save
          </button>
        </div>

        {/* Editor */}
        <div style={{ flex: 1 }}>
          <Editor
            language={language}
            theme="vs-dark"
            value={code}
            onChange={handleCodeChange}
            options={{
              fontSize: 16,
              minimap: { enabled: false },
              automaticLayout: true,
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
            }}
          />
        </div>

        {/* Optional login/register for guest */}
        {user.guest && (
          <div style={{ marginTop: "20px", padding: "10px", background: "#2d2d2d" }}>
            <h4 style={{ color: "#61dafb" }}>Want to save your code permanently? Register or Login:</h4>
            <div style={{ display: "flex", gap: "10px" }}>
              <LoginForm />
              <RegisterForm />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
