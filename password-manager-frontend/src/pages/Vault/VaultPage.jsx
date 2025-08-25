import React, { useEffect, useState } from "react";
import VaultEntryCard from "../../components/VaultEntryCard";
import { encryptString, decryptString } from "../../utils/zkCrypto";
import "./VaultPage.css";
const API_URL = import.meta.env.VITE_API_URL;

export default function VaultPage({ token, keyObj, onLogout }) {
  const [entries, setEntries] = useState([]);
  const [service, setService] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // generator options
  const [length, setLength] = useState(12);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [useUppercase, setUseUppercase] = useState(true);

  const commonServices = ["Gmail", "Facebook", "GitHub", "Twitter", "Amazon"];

  async function fetchEntries() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/vault`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const raw = await res.json();

    // decrypt passwords on client
    const decrypted = await Promise.all(
      raw.map(async (e) => ({
        id: e.id,
        service: e.service,
        username: e.username,
        password: await decryptString(e.passwordEncB64, e.ivB64, keyObj),
      }))
    );
    setEntries(decrypted);
  }

  async function deleteEntry(id) {
    const ok = window.confirm("Are you sure you want to delete this entry?");
    if (!ok) return;
    await fetch(`${import.meta.env.VITE_API_URL}/vault/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchEntries();
  }

  async function addEntry(e) {
    e.preventDefault();
    // encrypt password before sending
    const { ciphertextB64, ivB64 } = await encryptString(password, keyObj);
    await fetch(`${import.meta.env.VITE_API_URL}/vault`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        service,
        username,
        passwordEncB64: ciphertextB64,
        ivB64,
      }),
    });

    setService("");
    setUsername("");
    setPassword("");
    fetchEntries();
  }

  function generatePassword() {
    let chars = "abcdefghijklmnopqrstuvwxyz";
    if (useUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useNumbers) chars += "0123456789";
    if (useSymbols) chars += "!@#$%^&*()_+[]{}|;:,.<>?";
    let out = "";
    for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
    setPassword(out);
    setShowPassword(true);
  }

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="vault-layout">
      <button className="logout-btn" onClick={onLogout}>Logout</button>

      {/* Left: list */}
      <div className="vault-card">
        <h2>My Vault</h2>
        <div className="vault-list">
          {entries.length ? (
            entries.map((entry) => (
              <VaultEntryCard key={entry.id} entry={entry} onDelete={deleteEntry} />
            ))
          ) : (
            <p className="empty-text">No entries yet.</p>
          )}
        </div>
      </div>

      {/* Right: new entry */}
      <div className="vault-card">
        <h2>Add New Entry</h2>
        <form onSubmit={addEntry} className="vault-form">
          <select value={service} onChange={(e) => setService(e.target.value)}>
            <option value="">-- Select Service --</option>
            {commonServices.map((s) => <option key={s} value={s}>{s}</option>)}
            <option value="custom">Other (type manually)</option>
          </select>

          {service === "custom" && (
            <input type="text" placeholder="Custom Service" onChange={(e) => setService(e.target.value)} />
          )}

          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />

          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="toggle-visibility" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <div className="generator">
            <label>Length:
              <input type="number" min="6" max="64" value={length} onChange={(e) => setLength(Number(e.target.value))} />
            </label>
            <label><input type="checkbox" checked={useUppercase} onChange={() => setUseUppercase(!useUppercase)} /> Uppercase</label>
            <label><input type="checkbox" checked={useNumbers} onChange={() => setUseNumbers(!useNumbers)} /> Numbers</label>
            <label><input type="checkbox" checked={useSymbols} onChange={() => setUseSymbols(!useSymbols)} /> Symbols</label>
            <button type="button" onClick={generatePassword}>Generate 🔑</button>
          </div>

          <button type="submit" className="add-btn">Save</button>
        </form>
      </div>
    </div>
  );
}
