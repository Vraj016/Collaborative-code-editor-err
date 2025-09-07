// src/auth-user/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // For now, simulate login (replace with actual API later)
    const fakeToken = "dummy-jwt-token";
    const userData = { name: email, email };
    login(userData, fakeToken);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" style={{ padding: "6px 12px", background: "#007acc", color: "#fff", border: "none", borderRadius: 4 }}>
        Login
      </button>
    </form>
  );
}
