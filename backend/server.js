import dotenv from "dotenv";
dotenv.config({ quiet: true });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { connectDB } from "./utils/db.js";
import authRoutes from "../backend/routes/authRoutes.js";

connectDB();

const app = express();
const httpServer = http.createServer(app);

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

try {
  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
} catch (error) {
  console.error("The server failed to start", error);
  process.exit(1);
}
