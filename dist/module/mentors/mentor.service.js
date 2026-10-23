"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMentorService = exports.updateMentorService = exports.createMentorService = exports.getMentorByIdService = exports.getAllMentorsService = void 0;
const prisma_1 = require("../../db/prisma");
const AppError_1 = require("../../utils/AppError");
// Explicitly select public user fields.
const mentorUserSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    avatar: true,
    bio: true,
};
// GET all mentors
const getAllMentorsService = async () => {
    return prisma_1.prisma.mentor.findMany({
        include: {
            user: {
                select: mentorUserSelect,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getAllMentorsService = getAllMentorsService;
// GET one mentor
const getMentorByIdService = async (id) => {
    const mentor = await prisma_1.prisma.mentor.findUnique({
        where: { id },
        include: {
            user: {
                select: mentorUserSelect,
            },
        },
    });
    if (!mentor) {
        throw new AppError_1.AppError("Mentor not found", 404);
    }
    return mentor;
};
exports.getMentorByIdService = getMentorByIdService;
// CREATE mentor
const createMentorService = async (input) => {
    return prisma_1.prisma.mentor.create({
        data: {
            userId: input.userId,
            expertise: input.expertise,
            status: "PENDING",
            ...(input.experience !== undefined && {
                experience: input.experience,
            }),
            ...(input.hourlyRate !== undefined && {
                hourlyRate: input.hourlyRate,
            }),
            ...(input.availability !== undefined && {
                availability: input.availability,
            }),
        },
        include: {
            user: {
                select: mentorUserSelect,
            },
        },
    });
};
exports.createMentorService = createMentorService;
// UPDATE mentor
const updateMentorService = async (id, input) => {
    return prisma_1.prisma.mentor.update({
        where: { id },
        data: {
            ...(input.expertise !== undefined && {
                expertise: input.expertise,
            }),
            ...(input.experience !== undefined && {
                experience: input.experience,
            }),
            ...(input.hourlyRate !== undefined && {
                hourlyRate: input.hourlyRate,
            }),
            ...(input.availability !== undefined && {
                availability: input.availability,
            }),
            ...(input.status !== undefined && {
                status: input.status,
            }),
        },
        include: {
            user: {
                select: mentorUserSelect,
            },
        },
    });
};
exports.updateMentorService = updateMentorService;
// DELETE mentor
const deleteMentorService = async (id) => {
    await prisma_1.prisma.mentor.delete({
        where: { id },
    });
};
exports.deleteMentorService = deleteMentorService;
//# sourceMappingURL=mentor.service.js.map