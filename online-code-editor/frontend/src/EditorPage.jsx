// src/EditorPage.jsx
/*import { useState, useEffect } from "react";
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
  const [output, setOutput] = useState("");
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
  // Run code
  const runCode = async () => {
      setOutput("Running...");

      try {
          const res = await fetch("http://localhost:5000/api/execute", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ language, code }),
          });

          const data = await res.json();
          if (data.error) setOutput("❌ Error:\n" + data.error);
          else setOutput(data.output);
      } catch (err) {
          setOutput("❌ Server error: " + err.message);
      }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#1e1e1e", color: "#ddd" }}>
      {/* Sidebar *///}
      /*<div style={{ width: "250px", borderRight: "1px solid #333", padding: "12px", overflowY: "auto", background: "#252526" }}>
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

      {/* Main Editor *///}
      /*<div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div 
          style={{ 
            padding: "10px",
            borderBottom: "1px solid #333",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#2d2d2d"
          }}
        >
          <h2 style={{ flex: 1, margin: 0, color: "#61dafb" }}>Collaborative Code Editor</h2>
          <div
            style={{
              padding: "6px 12px",
              background: "#1e1e1e",
              borderRadius: "6px",
              color: "#61dafb",
              fontSize: "14px",
              border: "1px solid #444",
            }}
          >
            Detected: {language}
          </div>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Snippet Title" />
          {!user.guest && <button onClick={logout}>Logout</button>}
          <button onClick={handleSave}>Save</button>
        </div>

        <Editor language={language} theme="vs-dark" value={code} onChange={handleCodeChange} options={{ fontSize: 16, minimap: { enabled: true } }} />
      </div>
    </div>
  );
}
*/


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
  java: "java",
  csharp: "csharp",
  go: "go",
  ruby: "ruby",
  php: "php",
  plaintext: "plaintext",
  // add more if needed
};

export default function EditorPage() {
  const { user, setGuestUser, logout } = useAuth();
  const [code, setCode] = useState("// Start coding...");
  const [title, setTitle] = useState("");
  const [snippets, setSnippets] = useState([]);
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
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

  // RUN CODE
  const runCode = async () => {
    setOutput("Running...");
    try {
      const res = await fetch("http://localhost:5000/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });
      const data = await res.json();
      if (data.error) setOutput("❌ Error:\n" + data.error);
      else setOutput(data.output);
    } catch (err) {
      setOutput("❌ Server error: " + err.message);
    }
  };

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
              onClick={() => setCode(s.code)}
              style={{ cursor: "pointer", padding: "8px", background: activeSnippet === s.title ? "#333" : "transparent" }}
            >
              <strong>{s.title}</strong> <br />
              <small>({s.language})</small>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Editor */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header + Controls */}
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
          <h2 style={{ flex: 1, margin: 0, color: "#61dafb" }}>Collaborative Code Editor</h2>
          <div
            style={{
              padding: "6px 12px",
              background: "#1e1e1e",
              borderRadius: "6px",
              color: "#61dafb",
              fontSize: "14px",
              border: "1px solid #444",
            }}
          >
            Detected: {language}
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Snippet Title"
            style={{ padding: "6px", borderRadius: "4px", border: "1px solid #555", background: "#2d2d2d", color: "#ddd" }}
          />
          {!user.guest && (
            <button
              onClick={logout}
              style={{ padding: "6px 12px", background: "#d9534f", border: "none", borderRadius: "4px", color: "#fff", cursor: "pointer" }}
            >
              Logout
            </button>
          )}
          <button
            onClick={handleSave}
            style={{ padding: "6px 12px", background: "#0d6efd", border: "none", borderRadius: "4px", color: "#fff", cursor: "pointer" }}
          >
            Save
          </button>
          <button
            onClick={runCode}
            style={{ padding: "6px 12px", background: "#198754", border: "none", borderRadius: "4px", color: "#fff", cursor: "pointer" }}
          >
            ▶ Run
          </button>
        </div>

        {/* Editor */}
        <Editor
          language={language}
          theme="vs-dark"
          value={code}
          onChange={handleCodeChange}
          options={{ fontSize: 16, minimap: { enabled: true }, automaticLayout: true }}
          height="60vh"
        />

        {/* Output Terminal */}
        <div
          style={{
            background: "#1e1e1e",
            color: "#00ff00",
            padding: "15px",
            marginTop: "5px",
            borderRadius: "4px",
            width: "100%",
            height: "200px",
            overflow: "auto",
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
          }}
        >
          {output || "Output will appear here..."}
        </div>
      </div>
    </div>
  );
}
