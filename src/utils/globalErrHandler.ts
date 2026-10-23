import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { Prisma } from "../db/generated/prisma/client.js";
import {AppError} from "./AppError.js";

const isProduction = process.env.NODE_ENV === "production";

export const globalErrHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // 1. Zod validation
  if (error instanceof ZodError) {
    const errors = error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    res.status(400).json({
      success: false,
      message: errors[0]?.message ?? "Validation failed",
      errors,
    });
    return;
  }

  // 2. Custom error (new AppError("...", 404))
  if (error instanceof AppError) {
    res.status(error.status).json({ success: false, message: error.message });
    return;
  }

  // 3. Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      res.status(409).json({ success: false, message: "Already exists" });
      return;
    }
    if (error.code === "P2025") {
      res.status(404).json({ success: false, message: "Record not found" });
      return;
    }
    if (error.code === "P2003") {
      res
        .status(400)
        .json({ success: false, message: "Related record not found" });
      return;
    }
  }

  // 4. JWT
  if (error instanceof jwt.TokenExpiredError) {
    res
      .status(401)
      .json({ success: false, message: "Token expired, please login again" });
    return;
  }
  if (error instanceof jwt.JsonWebTokenError) {
    res.status(401).json({ success: false, message: "Invalid token" });
    return;
  }

  // 5. Invalid JSON body (express.json er error)
  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({ success: false, message: "Invalid JSON body" });
    return;
  }

  // 6. unexpected bug
  console.error(error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    // detail shudhu development e
    ...(!isProduction && error instanceof Error && { error: error.message }),
  });
};
