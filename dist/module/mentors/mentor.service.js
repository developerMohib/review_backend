"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAMentor = exports.updateAMentor = exports.createNewMentor = exports.getMentorById = exports.getAllMentors = void 0;
const client_1 = require("../../db/generated/prisma/client");
const prisma_1 = require("../../db/prisma");
const AppError_1 = require("../../utils/AppError");
// user er je field gulo mentor er shathe dekhano hobe (password nai)
const mentorUserSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    avatar: true,
    bio: true,
};
const handlePrismaError = (error) => {
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            throw new AppError_1.AppError("This user already has a mentor profile", 409);
        }
        if (error.code === "P2003") {
            throw new AppError_1.AppError("User not found", 404);
        }
        if (error.code === "P2025") {
            throw new AppError_1.AppError("Mentor not found", 404);
        }
    }
    throw error;
};
const getAllMentors = () => {
    return prisma_1.prisma.mentor.findMany({
        include: { user: { select: mentorUserSelect } },
        orderBy: { createdAt: "desc" },
    });
};
exports.getAllMentors = getAllMentors;
const getMentorById = (id) => {
    console.log('id ser', id);
    return prisma_1.prisma.mentor.findUnique({
        where: { id },
        include: { user: { select: mentorUserSelect } },
    });
};
exports.getMentorById = getMentorById;
const createNewMentor = async (input) => {
    try {
        return await prisma_1.prisma.mentor.create({
            data: {
                userId: input.userId,
                expertise: input.expertise,
                ...(input.experience !== undefined && { experience: input.experience }),
                ...(input.hourlyRate !== undefined && { hourlyRate: input.hourlyRate }),
                ...(input.availability !== undefined && { availability: input.availability }),
            },
            include: { user: { select: mentorUserSelect } },
        });
    }
    catch (error) {
        return handlePrismaError(error);
    }
};
exports.createNewMentor = createNewMentor;
const updateAMentor = async (id, input) => {
    try {
        return await prisma_1.prisma.mentor.update({
            where: { id },
            data: {
                ...(input.expertise !== undefined && { expertise: input.expertise }),
                ...(input.experience !== undefined && { experience: input.experience }),
                ...(input.hourlyRate !== undefined && { hourlyRate: input.hourlyRate }),
                ...(input.availability !== undefined && { availability: input.availability }),
                ...(input.status !== undefined && { status: input.status }),
            },
            include: { user: { select: mentorUserSelect } },
        });
    }
    catch (error) {
        return handlePrismaError(error);
    }
};
exports.updateAMentor = updateAMentor;
const deleteAMentor = async (id) => {
    try {
        await prisma_1.prisma.mentor.delete({ where: { id } });
    }
    catch (error) {
        handlePrismaError(error);
    }
};
exports.deleteAMentor = deleteAMentor;
//# sourceMappingURL=mentor.service.js.map