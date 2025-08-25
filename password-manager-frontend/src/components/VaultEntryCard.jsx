import React from "react";
import "./VaultEntryCard.css";

export default function VaultEntryCard({ entry, onDelete }) {
  const masked = "•".repeat(10);

  function copyPassword() {
    navigator.clipboard.writeText(entry.password);
    alert("Password copied!");
  }

  return (
    <div className="vault-entry">
      <span className="service">{entry.service}</span>
      <span className="username">{entry.username}</span>
      <span className="password">{masked}</span>
      <div className="actions">
        <button className="copy-btn" onClick={copyPassword}>Copy</button>
        <button className="delete-btn" onClick={() => onDelete(entry.id)} title="Delete">❌</button>
      </div>
    </div>
  );
}
