"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSubmissionsController = exports.getMySubmissionsController = exports.createSubmissionController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const submission_service_1 = require("./submission.service");
const submission_validation_1 = require("./submission.validation");
const AppError_1 = require("../../utils/AppError");
const prisma_1 = require("../../../generated/prisma");
exports.createSubmissionController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({
            success: false,
            message: "Unauthorized: User ID not found in request",
        });
        return;
    }
    const input = submission_validation_1.createSubmissionSchema.parse(req.body);
    const submission = await (0, submission_service_1.createSubmissionService)(userId, input);
    res.status(201).json({
        success: true,
        message: "Project submitted successfully and is pending review.",
        data: submission,
    });
    return;
});
exports.getMySubmissionsController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({
            success: false,
            message: "Unauthorized: User ID not found in request",
        });
        return;
    }
    const submissions = await (0, submission_service_1.getMySubmissionsService)(userId);
    res.status(200).json({
        success: true,
        message: "My submissions fetched successfully",
        data: submissions,
    });
    return;
});
exports.getAllSubmissionsController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (req.user?.role !== prisma_1.Role.mentor && req.user?.role !== prisma_1.Role.admin) {
        throw new AppError_1.AppError("You are not authorized to view all submissions", 403);
    }
    const submissions = await (0, submission_service_1.getAllSubmissionsService)();
    res.status(200).json({
        success: true,
        message: "My submissions fetched successfully",
        data: submissions,
    });
    return;
});
//# sourceMappingURL=submission.controller.js.map