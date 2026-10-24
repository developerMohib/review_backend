"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSubmissionsService = exports.getMySubmissionsService = exports.createSubmissionService = void 0;
const prisma_1 = require("../../../generated/prisma");
const prisma_2 = require("../../db/prisma");
const AppError_1 = require("../../utils/AppError");
const createSubmissionService = async (userId, input) => {
    // ১. Duplicate Submission Prevention (PDF Requirement)
    const existingPendingSubmission = await prisma_2.prisma.submission.findFirst({
        where: {
            userId: userId,
            status: prisma_1.SubmissionStatus.pending,
        },
    });
    if (existingPendingSubmission) {
        throw new AppError_1.AppError("You already have a pending submission. Please wait for the mentor's review before submitting a new one.");
    }
    // ২. Secure Data Creation
    const newSubmission = await prisma_2.prisma.submission.create({
        data: {
            projectName: input.projectName,
            category: input.category || null,
            repoUrl: input.repoUrl,
            liveUrl: input.liveUrl || "",
            description: input.description,
            status: prisma_1.SubmissionStatus.pending,
            userId: userId,
        },
    });
    return newSubmission;
};
exports.createSubmissionService = createSubmissionService;
const getMySubmissionsService = async (userId) => {
    return prisma_2.prisma.submission.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
};
exports.getMySubmissionsService = getMySubmissionsService;
const getAllSubmissionsService = async () => {
    return prisma_2.prisma.submission.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
};
exports.getAllSubmissionsService = getAllSubmissionsService;
//# sourceMappingURL=submission.service.js.map