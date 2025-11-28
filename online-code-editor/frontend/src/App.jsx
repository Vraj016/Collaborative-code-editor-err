// src/App.jsx
import { Routes, Route } from "react-router-dom";
import EditorPage from "./EditorPage.jsx";
import LoginForm from "./auth-user/Login.jsx";
import RegisterForm from "./auth-user/Register.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<EditorPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
    </Routes>
  );
}
