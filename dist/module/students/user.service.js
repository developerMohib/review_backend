"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("../../db/generated/prisma/client");
const AppError_1 = require("../../utils/AppError");
const prisma_1 = require("../../db/prisma");
// Prisma error ke readable AppError e convert kore
const handlePrismaError = (error) => {
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            throw new AppError_1.AppError("Email already exists", 409);
        }
        if (error.code === "P2025") {
            throw new AppError_1.AppError("User not found", 404);
        }
    }
    throw error;
};
const getAllUsers = () => {
    return prisma_1.prisma.user.findMany({
        omit: { password: true },
        include: { mentorProfile: true },
        orderBy: { createdAt: "desc" },
    });
};
exports.getAllUsers = getAllUsers;
const getUserById = (id) => {
    return prisma_1.prisma.user.findUnique({
        where: { id },
        omit: { password: true },
        include: { mentorProfile: true },
    });
};
exports.getUserById = getUserById;
const createUser = async (input) => {
    const hashedPassword = await bcryptjs_1.default.hash(input.password, 10);
    try {
        return await prisma_1.prisma.user.create({
            data: {
                name: input.name,
                email: input.email.toLowerCase().trim(),
                password: hashedPassword,
                ...(input.role && { role: input.role }),
                ...(input.phone !== undefined && { phone: input.phone }),
                ...(input.avatar !== undefined && { avatar: input.avatar }),
                ...(input.bio !== undefined && { bio: input.bio }),
            },
            omit: { password: true },
        });
    }
    catch (error) {
        return handlePrismaError(error);
    }
};
exports.createUser = createUser;
const updateUser = async (id, input) => {
    try {
        return await prisma_1.prisma.user.update({
            where: { id },
            data: {
                ...(input.name !== undefined && { name: input.name }),
                ...(input.phone !== undefined && { phone: input.phone }),
                ...(input.avatar !== undefined && { avatar: input.avatar }),
                ...(input.bio !== undefined && { bio: input.bio }),
                ...(input.isActive !== undefined && { isActive: input.isActive }),
            },
            omit: { password: true },
            include: { mentorProfile: true },
        });
    }
    catch (error) {
        return handlePrismaError(error);
    }
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    try {
        // Mentor profile auto delete hobe (schema te onDelete: Cascade ache)
        await prisma_1.prisma.user.delete({ where: { id } });
    }
    catch (error) {
        handlePrismaError(error);
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.service.js.map