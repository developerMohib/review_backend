import express from "express";
import type { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import { mentorRoutes } from "./module/mentors/mentor.routes.js";
import { userRoutes } from "./module/students/user.route.js";
import { globalErrHandler } from "./utils/globalErrHandler.js";
import { authRoutes } from "./module/auth/auth.routes.js";

const app: Application = express();

const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = new Set(
  (process.env.CLIENT_URL ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

// ---------- Security & logging ----------
app.use(helmet());
app.use(morgan(isProduction ? "combined" : "dev"));
app.use(compression());

app.use(
  cors({
    origin(origin, callback) {
      if (!isProduction || !origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  }),
);

// ---------- Rate limit (shudhu /api te) ----------
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  limit: 300, // per IP
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

// ---------- Parsers ----------
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ---------- Health routes ----------
app.get("/", (req: Request, res: Response) => {
  res.json({ success: true, message: "Mentor API is running" });
});

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ---------- API routes ----------
app.use("/api", apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mentors", mentorRoutes);

// ---------- 404 handler ----------
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ---------- Global error handler ----------
app.use(globalErrHandler);

export default app;
