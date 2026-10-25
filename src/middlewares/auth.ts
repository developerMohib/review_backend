import type { Request } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { prisma } from "../db/prisma";
import { Role } from "../../generated/prisma";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: Role;
  };
}

export const authenticate = asyncHandler(
  async (req: AuthRequest, _res, next): Promise<void> => {
    const token: unknown = req.cookies?.token;

    if (typeof token !== "string" || !token) {
      throw new AppError("Authentication required. Please log in.", 401);
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    // Matches your current loginService's HS256-signed JWT.
    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
    });

    // Your loginService signs { id: user.id, role: user.role }.
    if (
      typeof decoded === "string" ||
      typeof decoded.id !== "string" ||
      !decoded.id ||
      typeof decoded.exp !== "number"
    ) {
      throw new AppError("Invalid authentication token", 401);
    }

    // Use the current database role, not the potentially stale token role.
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new AppError("Authentication required. Please log in.", 401);
    }

    if (!user.isActive) {
      throw new AppError(
        "Your account is inactive. Please contact support.",
        403,
      );
    }

    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  },
);
