"use strict";
// login korte hoile db table user collection thek check korbo, is ative only
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.loginController = exports.registerController = void 0;
const auth_validators_1 = require("./auth.validators");
const auth_services_1 = require("./auth.services");
const zod_1 = require("zod");
const registerController = async (req, res) => {
    try {
        const validateInput = auth_validators_1.registerUserSchema.parse(req.body);
        const newStudent = await (0, auth_services_1.createStudentService)(validateInput);
        res.status(201).json({
            success: true,
            message: "Student registered successfully",
            data: newStudent,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errors = error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }));
            return res.status(400).json({
                success: false,
                message: errors[0]?.message ?? "Validation failed",
                errors,
            });
        }
        if (error.message === "Email already registered") {
            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.registerController = registerController;
const loginController = async (req, res) => {
    try {
        const validatedData = auth_validators_1.loginSchema.parse(req.body);
        const { token, user } = await (0, auth_services_1.loginService)(validatedData.email, validatedData.password);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: { user, token },
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errors = error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }));
            return res.status(400).json({
                success: false,
                message: errors[0]?.message ?? "Validation failed", // prothom error ta main message
                errors,
            });
        }
        if (error.message === "Invalid email or password") {
            return res.status(401).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.loginController = loginController;
const logoutUser = async (req, res) => {
    try {
        // HTTP-Only Cookie ক্লিয়ার করা
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/", // যেই path এ সেট করা হয়েছিল, সেখানেই ক্লিয়ার করতে হবে
        });
        res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Logout failed",
            error: error.message,
        });
    }
};
exports.logoutUser = logoutUser;
//# sourceMappingURL=auth.controllers.js.map