"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExistUser = exports.updateExistUser = exports.createNewUser = exports.getUser = exports.getUsers = void 0;
const user_service_1 = require("../module/students/user.service");
const AppError_1 = require("../utils/AppError");
const getUsers = async (req, res) => {
    const users = await (0, user_service_1.getAllUsers)();
    res.json({ success: true, data: users });
};
exports.getUsers = getUsers;
const getUser = async (req, res) => {
    const user = await (0, user_service_1.getUserById)(req.params.id);
    if (!user) {
        throw new AppError_1.AppError("User not found", 404);
    }
    res.json({ success: true, data: user });
};
exports.getUser = getUser;
const createNewUser = async (req, res) => {
    const { name, email, password, phone, avatar, bio } = req.body;
    if (!name || !email || !password) {
        throw new AppError_1.AppError("name, email and password are required", 400);
    }
    // role body theke neya hocche na: sobai STUDENT hishebe shuru hobe
    const user = await (0, user_service_1.createUser)({
        name,
        email,
        password,
        phone,
        avatar,
        bio,
    });
    res.status(201).json({ success: true, data: user });
};
exports.createNewUser = createNewUser;
const updateExistUser = async (req, res) => {
    const { name, phone, avatar, bio, isActive } = req.body;
    const user = await (0, user_service_1.updateUser)(req.params.id, {
        name,
        phone,
        avatar,
        bio,
        isActive,
    });
    res.json({ success: true, data: user });
};
exports.updateExistUser = updateExistUser;
const deleteExistUser = async (req, res) => {
    await (0, user_service_1.deleteUser)(req.params.id);
    res.json({ success: true, message: "User deleted successfully" });
};
exports.deleteExistUser = deleteExistUser;
//# sourceMappingURL=user.controller.js.map