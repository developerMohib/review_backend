"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asyncHandler_1 = require("../utils/asyncHandler");
const AppError_1 = require("../utils/AppError");
const prisma_1 = require("../db/prisma");
exports.authenticate = (0, asyncHandler_1.asyncHandler)(async (req, _res, next) => {
    // Cookie name matches res.cookie("token", ...).
    const token = req.cookies?.token;
    if (typeof token !== "string" || !token) {
        throw new AppError_1.AppError("Authentication required. Please log in.", 401);
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }
    // Matches your current loginService's HS256-signed JWT.
    const decoded = jsonwebtoken_1.default.verify(token, secret, {
        algorithms: ["HS256"],
    });
    // Your loginService signs { id: user.id, role: user.role }.
    if (typeof decoded === "string" ||
        typeof decoded.id !== "string" ||
        !decoded.id ||
        typeof decoded.exp !== "number") {
        throw new AppError_1.AppError("Invalid authentication token", 401);
    }
    // Use the current database role, not the potentially stale token role.
    const user = await prisma_1.prisma.user.findUnique({
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
        throw new AppError_1.AppError("Authentication required. Please log in.", 401);
    }
    if (!user.isActive) {
        throw new AppError_1.AppError("Your account is inactive. Please contact support.", 403);
    }
    req.user = {
        id: user.id,
        role: user.role,
    };
    next();
});
//# sourceMappingURL=auth.js.map