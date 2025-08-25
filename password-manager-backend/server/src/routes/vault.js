/* src/routes/vault.js */

import express from "express";
import VaultEntry from "../models/VaultEntry.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create
router.post("/", auth, async (req, res) => {
  try {
    const { service, username, passwordEncB64, ivB64 } = req.body;
    if (!service || !username || !passwordEncB64 || !ivB64) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const entry = await VaultEntry.create({
      userId: req.user.userId,
      service,
      username,
      passwordEncB64,
      ivB64,
    });

    res.status(201).json({ message: "Entry added", entryId: entry._id });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// List (no decrypt)
router.get("/", auth, async (req, res) => {
  try {
    const entries = await VaultEntry.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    const data = entries.map(e => ({
      id: e._id.toString(),
      service: e.service,
      username: e.username,
      passwordEncB64: e.passwordEncB64,
      ivB64: e.ivB64,
    }));
    res.json(data);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete
router.delete("/:id", auth, async (req, res) => {
  try {
    const entry = await VaultEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!entry) return res.status(404).json({ error: "Entry not found" });
    res.json({ message: "Entry deleted" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
