// src/utils/zkCrypto.js
const enc = new TextEncoder();
const dec = new TextDecoder();

function b64ToBytes(b64) {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}
function bytesToB64(bytes) {
  let binary = "";
  bytes.forEach(b => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

export async function deriveKey(password, encSaltB64) {
  const salt = b64ToBytes(encSaltB64);
  const baseKey = await crypto.subtle.importKey(
    "raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 310000, // modern recommendation
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    true, // exportable (so we can persist for 5 min)
    ["encrypt", "decrypt"]
  );
}

export async function encryptString(plaintext, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(plaintext)
  );
  return {
    ciphertextB64: bytesToB64(new Uint8Array(ct)),
    ivB64: bytesToB64(iv),
  };
}

export async function decryptString(ciphertextB64, ivB64, key) {
  const iv = b64ToBytes(ivB64);
  const data = b64ToBytes(ciphertextB64);
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  return dec.decode(pt);
}

// session key persistence (5 minutes)
const STORAGE_KEY = "zk_key_raw_b64";
const STORAGE_EXP = "zk_key_exp_ms";

export async function saveSessionKey(key, ttlMs = 5 * 60 * 1000) {
  const raw = new Uint8Array(await crypto.subtle.exportKey("raw", key));
  sessionStorage.setItem(STORAGE_KEY, bytesToB64(raw));
  sessionStorage.setItem(STORAGE_EXP, String(Date.now() + ttlMs));
}

export async function loadSessionKeyIfValid() {
  const exp = Number(sessionStorage.getItem(STORAGE_EXP));
  const b64 = sessionStorage.getItem(STORAGE_KEY);
  if (!exp || !b64 || Date.now() > exp) {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_EXP);
    return null;
  }
  const raw = b64ToBytes(b64);
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);
}

export function clearSessionKey() {
  sessionStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_EXP);
}
