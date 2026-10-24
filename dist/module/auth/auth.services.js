"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = exports.registerService = exports.getCurrentUserService = void 0;
// login korte hoile db table user collection thek check korbo, is ative only
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_js_1 = require("../../db/prisma.js");
const AppError_js_1 = require("../../utils/AppError.js");
const getCurrentUserService = async (userId) => {
    const user = await prisma_js_1.prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
        },
    });
    if (!user) {
        throw new AppError_js_1.AppError("User not found", 404);
    }
    if (!user.isActive) {
        throw new AppError_js_1.AppError("Your account is inactive. Please contact support.", 403);
    }
    return user;
};
exports.getCurrentUserService = getCurrentUserService;
const registerService = async (input) => {
    const hashedPassword = await bcryptjs_1.default.hash(input.password, 10);
    return prisma_js_1.prisma.user.create({
        data: {
            name: input.name.trim(),
            email: input.email.toLowerCase().trim(),
            password: hashedPassword,
            // Public signup defaults are controlled by the backend.
            role: "student",
            isActive: true,
            phone: null,
            avatar: null,
            bio: null,
        },
        omit: {
            password: true,
        },
    });
};
exports.registerService = registerService;
const loginService = async (email, password) => {
    const user = await prisma_js_1.prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
    });
    if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
        throw new AppError_js_1.AppError("Invalid email or password", 401);
    }
    if (!user.isActive) {
        throw new AppError_js_1.AppError("Your account is inactive. Please contact support.", 403);
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new AppError_js_1.AppError("JWT_SECRET is not configured", 500);
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, secret, {
        expiresIn: "7d",
    });
    const { password: _password, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
};
exports.loginService = loginService;
//# sourceMappingURL=auth.services.js.map