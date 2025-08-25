/* src/components/Vault.js */

import { useEffect, useState } from "react";
import API from "../api/axios";
import VaultEntry from "./VaultEntryCard";

export default function Vault({ setToken }) {
  const [entries, setEntries] = useState([]);
  const [service, setService] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const fetchEntries = async () => {
    try {
      const res = await API.get("/vault");
      setEntries(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addEntry = async (e) => {
    e.preventDefault();
    try {
      await API.post("/vault", { service, username, password });
      setService(""); setUsername(""); setPassword("");
      fetchEntries();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchEntries(); }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">🔐 My Vault</h2>
        <button onClick={logout} className="text-red-600 hover:underline">
          Logout
        </button>
      </div>

      <form onSubmit={addEntry} className="flex gap-2">
        <input
          value={service}
          onChange={(e) => setService(e.target.value)}
          placeholder="Service"
          className="flex-1 p-2 border rounded-md"
          required
        />
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="flex-1 p-2 border rounded-md"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="flex-1 p-2 border rounded-md"
          required
        />
        <button className="bg-green-600 text-white px-4 rounded-md">
          Add
        </button>
      </form>

      <div className="space-y-2">
        {entries.length === 0 ? (
          <p className="text-gray-500 text-center">No entries yet</p>
        ) : (
          entries.map((entry) => (
            <VaultEntry key={entry.id} entry={entry} />
          ))
        )}
      </div>
    </div>
  );
}
