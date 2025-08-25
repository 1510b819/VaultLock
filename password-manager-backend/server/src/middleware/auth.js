/* src/middleware/auth.js */

import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attaches { userId: ... }
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
