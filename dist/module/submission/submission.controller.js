"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSubmissionsController = exports.getMySubmissionsController = exports.createSubmissionController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const submission_service_1 = require("./submission.service");
const submission_validation_1 = require("./submission.validation");
exports.createSubmissionController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id || req.auth?.userId;
    console.log('user', userId);
    if (!userId) {
        res.status(401).json({
            success: false,
            message: "Unauthorized: User ID not found in request",
        });
        return;
    }
    console.log('req.bosy', req.body);
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const result = await (0, submission_service_1.getMySubmissionsService)(userId, page, limit, status);
    res.status(200).json({
        success: true,
        message: "My submissions fetched successfully",
        data: result,
    });
    return;
});
exports.getAllSubmissionsController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({
            success: false,
            message: "Unauthorized: User ID not found in request",
        });
        return;
    }
    // Query parameters from frontend (with defaults)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const result = await (0, submission_service_1.getAllSubmissionsService)(page, limit, status);
    res.status(200).json({
        success: true,
        message: "Submissions fetched successfully",
        data: result,
    });
});
//# sourceMappingURL=submission.controller.js.map