import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
  app.use(cookieParser());
// Routes
app.use("/api/auth", authRoutes);

// Sync Database
try {
  await sequelize.sync({ force: false });
  console.log(" Database synced");
} catch (error) {
  console.error("Database sync error:", error);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
