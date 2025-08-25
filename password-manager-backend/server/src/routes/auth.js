/* src/routes/auth.js */

import express from "express";
import User from "../models/User.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await argon2.hash(password); // auth only
    const encSaltB64 = crypto.randomBytes(16).toString("base64"); // for key derivation

    const user = await User.create({ email, passwordHash, encSaltB64 });
    res.status(201).json({ message: "User registered", userId: user._id });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
    );

    res.json({ token, encSaltB64: user.encSaltB64, userId: user._id });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
