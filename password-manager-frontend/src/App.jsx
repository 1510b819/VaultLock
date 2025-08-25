import React, { useEffect, useState } from "react";
import LoginPage from "./pages/Login/LoginPage";
import VaultPage from "./pages/Vault/VaultPage";
import { loadSessionKeyIfValid, clearSessionKey } from "./utils/zkCrypto";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [encSaltB64, setEncSaltB64] = useState(localStorage.getItem("encSaltB64") || "");
  const [key, setKey] = useState(null);

  useEffect(() => {
    // Try restore CryptoKey from 5-min session
    (async () => {
      const k = await loadSessionKeyIfValid();
      if (k) setKey(k);
    })();
  }, []);

  // ✅ Add/remove body class when login state changes
  useEffect(() => {
    if (token && encSaltB64 && key) {
      document.body.classList.add("logged-in");
    } else {
      document.body.classList.remove("logged-in");
    }
  }, [token, encSaltB64, key]);

function handleLogin({ token, encSaltB64, key }) {
  setToken(token);
  setEncSaltB64(encSaltB64);
  setKey(key);
  localStorage.setItem("token", token);
  localStorage.setItem("encSaltB64", encSaltB64);

  // trigger paint splash: add class then remove after animation
  document.body.classList.add("splash");
  // remove splash after ~1.1s (matches CSS 1000ms animation + small buffer)
  setTimeout(() => document.body.classList.remove("splash"), 1100);
}


function handleLogout() {
  // trigger logout splash
  document.body.classList.add("logout-splash");

  // clear auth state *after* splash
  setTimeout(() => {
    setToken(null);
    setEncSaltB64(null);
    setKey(null);
    localStorage.removeItem("token");
    localStorage.removeItem("encSaltB64");

    // remove splash class after animation
    document.body.classList.remove("logout-splash");
  }, 1100); // match animation duration
}


  if (!token || !encSaltB64 || !key) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <VaultPage token={token} keyObj={key} onLogout={handleLogout} />;
}
