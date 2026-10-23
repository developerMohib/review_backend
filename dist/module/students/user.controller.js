"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExistUser = exports.updateExistUser = exports.getOneUser = exports.getTotalUsers = void 0;
const user_service_1 = require("./user.service");
const zod_1 = require("zod");
const getTotalUsers = async (req, res) => {
    try {
        // jara only active status bohon kore
        const users = await (0, user_service_1.getAllUsers)();
        res.json({ success: true, data: users });
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
    }
};
exports.getTotalUsers = getTotalUsers;
const getOneUser = async (req, res) => {
    try {
        // jara only active status bohon kore nahoy no user
        const user = await (0, user_service_1.getUserById)(req.params.id);
        // pahadar bosate hobe
        res.json({ success: true, data: user });
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
    }
};
exports.getOneUser = getOneUser;
const updateExistUser = async (req, res) => {
    try {
        const { name, phone, avatar, bio, isActive } = req.body;
        const user = await (0, user_service_1.updateUser)(req.params.id, {
            name,
            phone,
            avatar,
            bio,
            isActive,
        });
        res.json({ success: true, data: user });
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
    }
};
exports.updateExistUser = updateExistUser;
const deleteExistUser = async (req, res) => {
    try {
        //status inactive kore dite hobe
        await (0, user_service_1.deleteUser)(req.params.id);
        res.json({ success: true, message: "User deleted successfully" });
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
    }
};
exports.deleteExistUser = deleteExistUser;
//# sourceMappingURL=user.controller.js.map