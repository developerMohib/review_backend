"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrHandler = void 0;
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_js_1 = require("../db/generated/prisma/client.js");
const AppError_js_1 = require("./AppError.js");
const isProduction = process.env.NODE_ENV === "production";
const globalErrHandler = (error, req, res, _next) => {
    // 1. Zod validation
    if (error instanceof zod_1.ZodError) {
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
    if (error instanceof AppError_js_1.AppError) {
        res.status(error.status).json({ success: false, message: error.message });
        return;
    }
    // 3. Prisma
    if (error instanceof client_js_1.Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            res.status(409).json({ success: false, message: "Accout already exists" });
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
    if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
        res
            .status(401)
            .json({ success: false, message: "Token expired, please login again" });
        return;
    }
    if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
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
exports.globalErrHandler = globalErrHandler;
//# sourceMappingURL=globalErrHandler.js.map