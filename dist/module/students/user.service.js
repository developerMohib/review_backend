"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserService = exports.updateUserService = exports.getUserByIdService = exports.getAllUsersService = void 0;
const prisma_js_1 = require("../../db/prisma.js");
const AppError_js_1 = require("../../utils/AppError.js");
const getAllUsersService = async () => {
    return prisma_js_1.prisma.user.findMany({
        omit: {
            password: true,
        },
        include: {
            mentorProfile: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getAllUsersService = getAllUsersService;
const getUserByIdService = async (id) => {
    const user = await prisma_js_1.prisma.user.findUnique({
        where: { id },
        omit: {
            password: true,
        },
        include: {
            mentorProfile: true,
        },
    });
    if (!user) {
        throw new AppError_js_1.AppError("User not found", 404);
    }
    return user;
};
exports.getUserByIdService = getUserByIdService;
const updateUserService = async (id, input) => {
    return prisma_js_1.prisma.user.update({
        where: { id },
        data: {
            ...(input.name !== undefined && {
                name: input.name,
            }),
            ...(input.phone !== undefined && {
                phone: input.phone,
            }),
            ...(input.avatar !== undefined && {
                avatar: input.avatar,
            }),
            ...(input.bio !== undefined && {
                bio: input.bio,
            }),
            ...(input.isActive !== undefined && {
                isActive: input.isActive,
            }),
        },
        omit: {
            password: true,
        },
        include: {
            mentorProfile: true,
        },
    });
};
exports.updateUserService = updateUserService;
const deleteUserService = async (id) => {
    await prisma_js_1.prisma.user.update({
        where: { id },
        data: {
            isActive: false,
        },
    });
};
exports.deleteUserService = deleteUserService;
//# sourceMappingURL=user.service.js.map