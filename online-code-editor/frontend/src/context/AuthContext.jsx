// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

// Create the useAuth hook for easier context consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      try {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        setUser(savedUser);
      } catch (err) {
        console.error("Error parsing user data:", err);
        logout(); // Clear invalid data
      }
    }
  }, [token]);

  // Login with credentials
  const login = async (userData, jwt) => {
    try {
      setLoading(true);
      setError("");
      
      // In a real app, you would make an API call here
      // For demo purposes, we'll simulate an API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate inputs
      if (!userData || !jwt) {
        throw new Error("Invalid login data");
      }
      
      setUser(userData);
      setToken(jwt);
      localStorage.setItem("token", jwt);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    setError("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Generate a guest user
  const setGuestUser = () => {
    const guest = { 
      name: `Guest_${Math.floor(Math.random() * 10000)}`, 
      guest: true 
    };
    setUser(guest);
    localStorage.setItem("user", JSON.stringify(guest));
  };

  // Clear error
  const clearError = () => setError("");

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading,
      error,
      login, 
      logout, 
      setGuestUser,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};