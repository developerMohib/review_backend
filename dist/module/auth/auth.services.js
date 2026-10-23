"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = exports.createStudentService = void 0;
// login korte hoile db table user collection thek check korbo, is ative only
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_js_1 = require("../../db/prisma.js");
const AppError_js_1 = require("../../utils/AppError.js");
const handleCustomPrismaErr_js_1 = require("../../utils/handleCustomPrismaErr.js");
const createStudentService = async (input) => {
    const hashedPassword = await bcryptjs_1.default.hash(input.password, 10);
    try {
        const newUser = await prisma_js_1.prisma.user.create({
            data: {
                name: input.name,
                email: input.email.toLowerCase().trim(),
                password: hashedPassword,
                role: input.role || "STUDENT",
                isActive: input.isActive !== undefined ? input.isActive : true,
                phone: input.phone || null,
                avatar: input.avatar || null,
                bio: input.bio || null,
            },
            omit: {
                password: true,
            },
        });
        return newUser;
    }
    catch (error) {
        return (0, handleCustomPrismaErr_js_1.handlePrismaError)(error);
    }
};
exports.createStudentService = createStudentService;
const loginService = async (email, password) => {
    const user = await prisma_js_1.prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
    });
    if (!user) {
        throw new AppError_js_1.AppError("Invalid email or password", 401);
    }
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError_js_1.AppError("Invalid email or password", 401);
    }
    // inactive user hole "not found" dibe
    if (!user.isActive) {
        throw new AppError_js_1.AppError("User not found", 404);
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not set");
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, secret, {
        expiresIn: "7d",
    });
    const { password: _password, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
};
exports.loginService = loginService;
//# sourceMappingURL=auth.services.js.map