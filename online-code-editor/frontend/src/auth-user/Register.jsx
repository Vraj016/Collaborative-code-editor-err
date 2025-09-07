// src/auth-user/Register.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterForm() {
  const { login, loading, error, clearError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    clearError();
  }, []);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!name) {
      errors.name = "Name is required";
    }
    
    if (!email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // For now, simulate registration (replace with actual API later)
      const fakeToken = "dummy-jwt-token";
      const userData = { name, email };
      await login(userData, fakeToken);
    } catch (err) {
      // Error is already handled in the context
      console.error("Registration error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "300px" }}>
      <h2 style={{ margin: "0 0 10px 0" }}>Register</h2>
      
      {error && (
        <div style={{ color: "red", padding: "8px", backgroundColor: "#ffeeee", borderRadius: "4px" }}>
          {error}
        </div>
      )}
      
      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          style={{ 
            width: "100%", 
            padding: "10px", 
            border: formErrors.name ? "1px solid red" : "1px solid #ccc",
            borderRadius: "4px"
          }}
        />
        {formErrors.name && (
          <div style={{ color: "red", fontSize: "0.8rem", marginTop: "4px" }}>
            {formErrors.name}
          </div>
        )}
      </div>
      
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          style={{ 
            width: "100%", 
            padding: "10px", 
            border: formErrors.email ? "1px solid red" : "1px solid #ccc",
            borderRadius: "4px"
          }}
        />
        {formErrors.email && (
          <div style={{ color: "red", fontSize: "0.8rem", marginTop: "4px" }}>
            {formErrors.email}
          </div>
        )}
      </div>
      
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          style={{ 
            width: "100%", 
            padding: "10px", 
            border: formErrors.password ? "1px solid red" : "1px solid #ccc",
            borderRadius: "4px"
          }}
        />
        {formErrors.password && (
          <div style={{ color: "red", fontSize: "0.8rem", marginTop: "4px" }}>
            {formErrors.password}
          </div>
        )}
      </div>
      
      <div>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
          style={{ 
            width: "100%", 
            padding: "10px", 
            border: formErrors.confirmPassword ? "1px solid red" : "1px solid #ccc",
            borderRadius: "4px"
          }}
        />
        {formErrors.confirmPassword && (
          <div style={{ color: "red", fontSize: "0.8rem", marginTop: "4px" }}>
            {formErrors.confirmPassword}
          </div>
        )}
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        style={{ 
          padding: "10px", 
          background: loading ? "#ccc" : "#28a745", 
          color: "#fff", 
          border: "none", 
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Creating Account..." : "Register"}
      </button>
    </form>
  );
}