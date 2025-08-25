/* src/utils/crypto.js */

import crypto from "crypto";

const ALGO = "aes-256-gcm";
const SECRET = crypto
  .createHash("sha256")
  .update(process.env.ENCRYPTION_KEY || "fallback_key")
  .digest();

const IV_LENGTH = 16;

export function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, SECRET, iv);
  const enc = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return iv.toString("hex") + ":" + tag.toString("hex") + ":" + enc.toString("hex");
}

export function decrypt(data) {
  const [ivHex, tagHex, encHex] = data.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const enc = Buffer.from(encHex, "hex");
  const decipher = crypto.createDecipheriv(ALGO, SECRET, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return dec.toString("utf8");
}
