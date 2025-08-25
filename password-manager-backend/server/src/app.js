import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from "./routes/auth.js";  
import vaultRoutes from "./routes/vault.js";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

  app.use("/auth", authRoutes);
  app.use("/vault", vaultRoutes);
