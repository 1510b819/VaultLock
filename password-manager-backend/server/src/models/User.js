/* src/models/User.js */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true }, // for auth only
    encSaltB64: { type: String, required: true },   // for frontend key derivation
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
