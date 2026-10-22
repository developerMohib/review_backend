"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMentor = exports.updateMentor = exports.createMentor = exports.getMentor = exports.getMentors = void 0;
const mentor_service_1 = require("./mentor.service");
const AppError_1 = require("../../utils/AppError");
const enums_1 = require("../../db/generated/prisma/enums");
const isStringArray = (value) => Array.isArray(value) && value.every((item) => typeof item === "string");
const isNonNegativeNumber = (value) => typeof value === "number" && Number.isFinite(value) && value >= 0;
const getMentors = async (req, res) => {
    const mentors = await (0, mentor_service_1.getAllMentors)();
    res.json({ success: true, data: mentors });
};
exports.getMentors = getMentors;
const getMentor = async (req, res) => {
    const mentor = await (0, mentor_service_1.getMentorById)(req.params.id);
    console.log(' id', req.params.id);
    if (!mentor) {
        throw new AppError_1.AppError("Mentor not found", 404);
    }
    res.json({ success: true, data: mentor });
};
exports.getMentor = getMentor;
const createMentor = async (req, res) => {
    const { userId, expertise, experience, hourlyRate, availability } = req.body;
    if (typeof userId !== "string" || !userId) {
        throw new AppError_1.AppError("userId is required", 400);
    }
    if (!isStringArray(expertise) || expertise.length === 0) {
        throw new AppError_1.AppError("expertise must be a non-empty array of strings", 400);
    }
    if (experience !== undefined && !isNonNegativeNumber(experience)) {
        throw new AppError_1.AppError("experience must be a non-negative number", 400);
    }
    if (hourlyRate !== undefined && !isNonNegativeNumber(hourlyRate)) {
        throw new AppError_1.AppError("hourlyRate must be a non-negative number", 400);
    }
    // status body theke neya hocche na: notun mentor shobsomoy PENDING
    const mentor = await (0, mentor_service_1.createNewMentor)({
        userId,
        expertise,
        experience,
        hourlyRate,
        availability,
    });
    res.status(201).json({ success: true, data: mentor });
};
exports.createMentor = createMentor;
const updateMentor = async (req, res) => {
    const { expertise, experience, hourlyRate, availability, status } = req.body;
    if (expertise !== undefined && !isStringArray(expertise)) {
        throw new AppError_1.AppError("expertise must be an array of strings", 400);
    }
    if (experience !== undefined && !isNonNegativeNumber(experience)) {
        throw new AppError_1.AppError("experience must be a non-negative number", 400);
    }
    if (hourlyRate !== undefined && !isNonNegativeNumber(hourlyRate)) {
        throw new AppError_1.AppError("hourlyRate must be a non-negative number", 400);
    }
    if (status !== undefined && !Object.values(enums_1.MentorStatus).includes(status)) {
        throw new AppError_1.AppError("status must be PENDING, APPROVED or REJECTED", 400);
    }
    const mentor = await (0, mentor_service_1.updateAMentor)(req.params.id, {
        expertise,
        experience,
        hourlyRate,
        availability,
        status,
    });
    res.json({ success: true, data: mentor });
};
exports.updateMentor = updateMentor;
const deleteMentor = async (req, res) => {
    await (0, mentor_service_1.deleteAMentor)(req.params.id);
    res.json({ success: true, message: "Mentor deleted successfully" });
};
exports.deleteMentor = deleteMentor;
//# sourceMappingURL=mentor.controller.js.map