/* src/components/AuthForm.js */

import { useState } from "react";
import API from "../api/axios";

export default function AuthForm({ setToken }) {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "register") {
        await API.post("/auth/register", { email, password });
        setMessage("✅ Registered! Please log in.");
        setMode("login");
      } else {
        const res = await API.post("/auth/login", { email, password });
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
      }
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.error || "Error"));
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {mode === "login" ? "Login" : "Register"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          className="p-2 border rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>
      <p className="mt-2 text-sm text-center text-gray-600">{message}</p>
      <p className="mt-4 text-sm text-center">
        {mode === "login" ? (
          <>
            Don’t have an account?{" "}
            <button
              onClick={() => setMode("register")}
              className="text-blue-600 underline"
            >
              Register
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              onClick={() => setMode("login")}
              className="text-blue-600 underline"
            >
              Login
            </button>
          </>
        )}
      </p>
    </div>
  );
}
