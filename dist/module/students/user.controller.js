"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserController = exports.updateUserController = exports.getUserByIdController = exports.getAllUsersController = void 0;
const AppError_js_1 = require("../../utils/AppError.js");
const asyncHandler_js_1 = require("../../utils/asyncHandler.js");
const user_service_js_1 = require("./user.service.js");
const user_validator_js_1 = require("./user.validator.js");
// import { updateUserSchema } from "./user.validator.js";
// Shared route-parameter check.
const getUserId = (req) => {
    const id = req.params.id;
    if (typeof id !== "string" || !id.trim()) {
        throw new AppError_js_1.AppError("User id is required", 400);
    }
    return id.trim();
};
exports.getAllUsersController = (0, asyncHandler_js_1.asyncHandler)(async (_req, res) => {
    const users = await (0, user_service_js_1.getAllUsersService)();
    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users,
    });
});
exports.getUserByIdController = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const id = getUserId(req);
    const user = await (0, user_service_js_1.getUserByIdService)(id);
    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user,
    });
});
exports.updateUserController = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const id = getUserId(req);
    const validatedInput = user_validator_js_1.updateUserSchema.parse(req.body);
    const user = await (0, user_service_js_1.updateUserService)(id, validatedInput);
    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user,
    });
});
exports.deleteUserController = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const id = getUserId(req);
    await (0, user_service_js_1.deleteUserService)(id);
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
});
//# sourceMappingURL=user.controller.js.map