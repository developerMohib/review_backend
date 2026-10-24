"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubmission = void 0;
const prisma_1 = require("../../db/prisma");
const AppError_1 = require("../../utils/AppError");
const createSubmission = async (userId, data) => {
    const existingPending = await prisma_1.prisma.submission.findFirst({
        where: {
            userId: userId,
            status: 'pending',
        },
    });
    if (existingPending) {
        throw new AppError_1.AppError("You already have a pending submission. Please wait for mentor review.", 400);
    }
    // ২. নতুন সাবমিশন তৈরি
    const submission = await prisma_1.prisma.submission.create({
        data: {
            ...data,
            userId,
            status: 'pending',
        },
    });
    return submission;
};
exports.createSubmission = createSubmission;
//# sourceMappingURL=submission.service.js.map