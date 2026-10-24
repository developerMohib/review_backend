"use strict";
// login korte hoile db table user collection thek check korbo, is ative only
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.loginController = exports.registerController = exports.getCurrentUserController = void 0;
const auth_validators_1 = require("./auth.validators");
const auth_services_1 = require("./auth.services");
const asyncHandler_1 = require("../../utils/asyncHandler");
const AppError_js_1 = require("../../utils/AppError.js");
exports.getCurrentUserController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError_js_1.AppError("Authentication required", 401);
    }
    const user = await (0, auth_services_1.getCurrentUserService)(userId);
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({
        success: true,
        data: user,
    });
});
exports.registerController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const validatedInput = auth_validators_1.registerUserSchema.parse(req.body);
    const newStudent = await (0, auth_services_1.registerService)(validatedInput);
    res.status(201).json({
        success: true,
        message: "Student registered successfully",
        data: newStudent,
    });
});
exports.loginController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const validatedData = auth_validators_1.loginSchema.parse(req.body);
    const { token, user } = await (0, auth_services_1.loginService)(validatedData.email, validatedData.password);
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // ক্রস-অরিজিনের জন্য 'none' লাগবে
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // ৪. Success Response
    res.status(200).json({
        success: true,
        message: "Login successful",
        data: { user, token },
    });
});
exports.logoutUser = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
    });
    res.status(200).json({
        success: true,
        message: "Logout successful",
    });
});
//# sourceMappingURL=auth.controllers.js.map