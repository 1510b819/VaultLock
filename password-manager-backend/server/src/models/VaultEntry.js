/* src/models/VaultEntry.js */

import mongoose from "mongoose";

const vaultEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    service: { type: String, required: true, index: true },
    username: { type: String, required: true },
    // zero-knowledge payload
    passwordEncB64: { type: String, required: true },
    ivB64: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("VaultEntry", vaultEntrySchema);
