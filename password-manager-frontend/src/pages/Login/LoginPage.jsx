import React, { useState } from "react";
import { deriveKey, saveSessionKey } from "../../utils/zkCrypto";
import "./LoginPage.css";
const API_URL = import.meta.env.VITE_API_URL;

import { Toaster, toast } from "react-hot-toast";

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const endpoint =
      mode === "login"
        ? `${import.meta.env.VITE_API_URL}/auth/login`
        : `${import.meta.env.VITE_API_URL}/auth/register`;


    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (mode === "register" && data.message) {
      toast.success("Account created! You can log in now.");
      setMode("login");
      return;
    }

    if (mode === "login" && data.token && data.encSaltB64) {
      const key = await deriveKey(password, data.encSaltB64);
      await saveSessionKey(key, 5 * 60 * 1000); // 5 minutes
      onLogin({ token: data.token, encSaltB64: data.encSaltB64, key });
      return;
    }

    toast.error(data.error || "Something went wrong");
  }

  return (
    <div className="login-container">
      <Toaster/>
      <div className="login-card">
        <h1 className="title">VaultLock</h1>
        <p className="subtitle">
          {mode === "login"
            ? "Welcome back, login to your vault"
            : "Create a new VaultLock account"}
        </p>

        <form onSubmit={handleSubmit} className="form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
          <button type="submit" className="btn">
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <div className="switch-mode">
          {mode === "login" ? (
            <button
              className="link"
              onClick={() => setMode("register")}
            >
              Create account
            </button>
          ) : (
            <button
              className="link"
              onClick={() => setMode("login")}
            >
              Back to login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
