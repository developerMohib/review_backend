"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubmissionStatusService = exports.getAllSubmissionsService = exports.getMySubmissionsService = exports.createSubmissionService = void 0;
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
const getMySubmissionsService = async (userId, page, limit, status) => {
    const currentPage = Math.max(1, page);
    const pageSize = Math.max(1, Math.min(limit, 50));
    const skip = (currentPage - 1) * pageSize;
    const where = {
        userId,
        ...(status ? { status: status } : {}),
    };
    const [submissions, total] = await Promise.all([
        prisma_2.prisma.submission.findMany({
            where,
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: pageSize,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        }),
        prisma_2.prisma.submission.count({ where }),
    ]);
    return {
        submissions,
        pagination: {
            total,
            page: currentPage,
            limit: pageSize,
            totalPages: Math.ceil(total / pageSize),
        },
    };
};
exports.getMySubmissionsService = getMySubmissionsService;
const getAllSubmissionsService = async (page, limit, status) => {
    try {
        const skip = (page - 1) * limit;
        const whereClause = {};
        if (status) {
            whereClause.status = status;
        }
        const [submissions, totalCount] = await Promise.all([
            prisma_2.prisma.submission.findMany({
                where: whereClause,
                skip,
                take: limit,
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
            }),
            prisma_2.prisma.submission.count({
                where: whereClause,
            }),
        ]);
        // Stats calculation
        const statsData = await prisma_2.prisma.submission.groupBy({
            by: ['status'],
            _count: {
                status: true,
            },
        });
        const stats = { total: 0, pending: 0, approved: 0, rejected: 0 };
        statsData.forEach((s) => {
            const count = s._count.status;
            stats.total += count;
            const lowerStatus = s.status.toLowerCase();
            if (lowerStatus === 'pending')
                stats.pending = count;
            else if (lowerStatus === 'approved')
                stats.approved = count;
            else if (lowerStatus === 'rejected')
                stats.rejected = count;
        });
        return {
            submissions,
            pagination: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
            },
            stats,
        };
    }
    catch (error) {
        console.error("❌ Database Error in getAllSubmissionsService:", error);
        throw error;
    }
};
exports.getAllSubmissionsService = getAllSubmissionsService;
const FEEDBACK_COMMENTS = {
    approved: "Your project has been reviewed and approved by the mentor. Great work!",
    rejected: "Your project has been reviewed and rejected by the mentor. Please review the feedback and try again.",
};
const updateSubmissionStatusService = async (submissionId, mentorId, status) => {
    const existingSubmission = await prisma_2.prisma.submission.findUnique({
        where: {
            id: submissionId,
        },
    });
    if (!existingSubmission) {
        throw new AppError_1.AppError("Submission not found");
    }
    if (existingSubmission.status === status) {
        throw new AppError_1.AppError(`Submission is already ${status}`);
    }
    const updatedSubmission = await prisma_2.prisma.submission.update({
        where: {
            id: submissionId,
        },
        data: {
            status,
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
    await prisma_2.prisma.feedback.upsert({
        where: {
            submissionId_mentorId: {
                submissionId,
                mentorId,
            },
        },
        update: {
            comment: FEEDBACK_COMMENTS[status],
        },
        create: {
            submissionId,
            mentorId,
            comment: FEEDBACK_COMMENTS[status],
        },
    });
    return updatedSubmission;
};
exports.updateSubmissionStatusService = updateSubmissionStatusService;
//# sourceMappingURL=submission.service.js.map