import { Router } from "express";
import { createMentor, deleteMentor, getMentor, getMentors, updateMentor } from "./mentor.controller";

const router = Router();

router.get("/", getMentors);
router.get("/:id", getMentor);
router.post("/", createMentor);
router.patch("/:id", updateMentor);
router.delete("/:id", deleteMentor);

export const mentorRoutes = router;