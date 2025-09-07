// src/auth-user/Register.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function RegisterForm() {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // For now, simulate registration (replace with actual API later)
    const fakeToken = "dummy-jwt-token";
    const userData = { name, email };
    login(userData, fakeToken);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
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
      <button type="submit" style={{ padding: "6px 12px", background: "#28a745", color: "#fff", border: "none", borderRadius: 4 }}>
        Register
      </button>
    </form>
  );
}
