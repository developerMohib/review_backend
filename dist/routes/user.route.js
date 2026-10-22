"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const prisma_js_1 = require("../db/prisma.js");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    const users = await prisma_js_1.prisma.user.findMany({
        include: {
            mentorProfile: true,
        },
    });
    res.json({
        success: true,
        data: users,
    });
});
router.get("/:id", async (req, res) => {
    const user = await prisma_js_1.prisma.user.findUnique({
        where: { id: req.params.id },
        include: {
            mentorProfile: true,
        },
    });
    if (!user) {
        res.status(404).json({
            success: false,
            message: "User not found",
        });
        return;
    }
    res.json({
        success: true,
        data: user,
    });
});
router.post("/", async (req, res) => {
    const { name, email, password, role, phone, bio } = req.body;
    const user = await prisma_js_1.prisma.user.create({
        data: {
            name,
            email,
            password,
            role,
            phone,
            bio,
        },
    });
    res.status(201).json({
        success: true,
        data: user,
    });
});
router.patch("/:id", async (req, res) => {
    const { name, phone, bio, isActive } = req.body;
    const user = await prisma_js_1.prisma.user.update({
        where: { id: req.params.id },
        data: {
            name,
            phone,
            bio,
            isActive,
        },
    });
    res.json({
        success: true,
        data: user,
    });
});
router.delete("/:id", async (req, res) => {
    await prisma_js_1.prisma.user.delete({
        where: { id: req.params.id },
    });
    res.json({
        success: true,
        message: "User deleted successfully",
    });
});
exports.userRoutes = router;
//# sourceMappingURL=user.route.js.map