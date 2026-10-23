"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const prisma_1 = require("../../db/prisma");
const handleCustomPrismaErr_1 = require("../../utils/handleCustomPrismaErr");
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
        return (0, handleCustomPrismaErr_1.handlePrismaError)(error);
    }
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    try {
        // Mentor profile auto delete hobe (schema te onDelete: Cascade ache)
        await prisma_1.prisma.user.delete({ where: { id } });
    }
    catch (error) {
        (0, handleCustomPrismaErr_1.handlePrismaError)(error);
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.service.js.map