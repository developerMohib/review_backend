"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMentorController = exports.updateMentorController = exports.createMentorController = exports.getMentorByIdController = exports.getAllMentorsController = void 0;
const prisma_1 = require("../../db/generated/prisma");
const asyncHandler_js_1 = require("../../utils/asyncHandler.js");
const mentor_service_js_1 = require("./mentor.service.js");
const AppError_js_1 = require("../../utils/AppError.js");
const isNonEmptyStringArray = (value) => Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === "string" &&
        item.trim().length > 0);
const isNonNegativeNumber = (value) => typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0;
const isMentorStatus = (value) => typeof value === "string" &&
    Object.values(prisma_1.MentorStatus).some((status) => status === value);
const getMentorId = (req) => {
    const id = req.params.id;
    if (typeof id !== "string" || !id.trim()) {
        throw new AppError_js_1.AppError("Mentor id is required", 400);
    }
    return id.trim();
};
const getRequestBody = (body) => {
    if (typeof body !== "object" ||
        body === null ||
        Array.isArray(body)) {
        throw new AppError_js_1.AppError("Request body must be an object", 400);
    }
    return body;
};
// GET all mentors
exports.getAllMentorsController = (0, asyncHandler_js_1.asyncHandler)(async (_req, res) => {
    const mentors = await (0, mentor_service_js_1.getAllMentorsService)();
    res.status(200).json({
        success: true,
        message: "Mentors fetched successfully",
        data: mentors,
    });
});
// GET one mentor
exports.getMentorByIdController = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const id = getMentorId(req);
    const mentor = await (0, mentor_service_js_1.getMentorByIdService)(id);
    res.status(200).json({
        success: true,
        message: "Mentor fetched successfully",
        data: mentor,
    });
});
// CREATE mentor
exports.createMentorController = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { userId, expertise, experience, hourlyRate, availability, } = getRequestBody(req.body);
    if (typeof userId !== "string" || !userId.trim()) {
        throw new AppError_js_1.AppError("userId is required", 400);
    }
    if (!isNonEmptyStringArray(expertise)) {
        throw new AppError_js_1.AppError("expertise must be a non-empty array of non-empty strings", 400);
    }
    if (experience !== undefined &&
        !isNonNegativeNumber(experience)) {
        throw new AppError_js_1.AppError("experience must be a non-negative number", 400);
    }
    if (hourlyRate !== undefined &&
        !isNonNegativeNumber(hourlyRate)) {
        throw new AppError_js_1.AppError("hourlyRate must be a non-negative number", 400);
    }
    if (availability !== undefined &&
        typeof availability !== "string") {
        throw new AppError_js_1.AppError("availability must be a string", 400);
    }
    const mentor = await (0, mentor_service_js_1.createMentorService)({
        userId: userId.trim(),
        expertise: expertise.map((item) => item.trim()),
        experience,
        hourlyRate,
        availability: availability === undefined
            ? undefined
            : availability.trim(),
    });
    res.status(201).json({
        success: true,
        message: "Mentor created successfully",
        data: mentor,
    });
});
// UPDATE mentor
exports.updateMentorController = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const id = getMentorId(req);
    const { expertise, experience, hourlyRate, availability, status, } = getRequestBody(req.body);
    if (expertise !== undefined &&
        !isNonEmptyStringArray(expertise)) {
        throw new AppError_js_1.AppError("expertise must be a non-empty array of non-empty strings", 400);
    }
    if (experience !== undefined &&
        !isNonNegativeNumber(experience)) {
        throw new AppError_js_1.AppError("experience must be a non-negative number", 400);
    }
    if (hourlyRate !== undefined &&
        !isNonNegativeNumber(hourlyRate)) {
        throw new AppError_js_1.AppError("hourlyRate must be a non-negative number", 400);
    }
    if (availability !== undefined &&
        typeof availability !== "string") {
        throw new AppError_js_1.AppError("availability must be a string", 400);
    }
    if (status !== undefined &&
        !isMentorStatus(status)) {
        throw new AppError_js_1.AppError("status must be PENDING, APPROVED or REJECTED", 400);
    }
    if (expertise === undefined &&
        experience === undefined &&
        hourlyRate === undefined &&
        availability === undefined &&
        status === undefined) {
        throw new AppError_js_1.AppError("Provide at least one field to update", 400);
    }
    const mentor = await (0, mentor_service_js_1.updateMentorService)(id, {
        expertise: expertise === undefined
            ? undefined
            : expertise.map((item) => item.trim()),
        experience,
        hourlyRate,
        availability: availability === undefined
            ? undefined
            : availability.trim(),
        status,
    });
    res.status(200).json({
        success: true,
        message: "Mentor updated successfully",
        data: mentor,
    });
});
// DELETE mentor
exports.deleteMentorController = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const id = getMentorId(req);
    await (0, mentor_service_js_1.deleteMentorService)(id);
    res.status(200).json({
        success: true,
        message: "Mentor deleted successfully",
    });
});
//# sourceMappingURL=mentor.controller.js.map