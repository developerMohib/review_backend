import { Router } from "express";
import { prisma } from "../db/prisma.js";
const router = Router();
router.get("/", async (req, res) => {
    const mentors = await prisma.mentor.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    bio: true,
                },
            },
        },
    });
    res.json({
        success: true,
        data: mentors,
    });
});
router.post("/", async (req, res) => {
    const { userId, expertise, experience, hourlyRate, availability } = req.body;
    const mentor = await prisma.mentor.create({
        data: {
            userId,
            expertise,
            experience,
            hourlyRate,
            availability,
        },
    });
    res.status(201).json({
        success: true,
        data: mentor,
    });
});
router.patch("/:id", async (req, res) => {
    const { expertise, experience, hourlyRate, availability, status } = req.body;
    const mentor = await prisma.mentor.update({
        where: { id: req.params.id },
        data: {
            expertise,
            experience,
            hourlyRate,
            availability,
            status,
        },
    });
    res.json({
        success: true,
        data: mentor,
    });
});
router.delete("/:id", async (req, res) => {
    await prisma.mentor.delete({
        where: { id: req.params.id },
    });
    res.json({
        success: true,
        message: "Mentor deleted successfully",
    });
});
export const mentorRoutes = router;
//# sourceMappingURL=mentor.routes.js.map