import { Router } from "express";
import { createMentor, deleteMentor, getMentor, getMentors, updateMentor } from "./mentor.controller";

const router = Router();

router.get("/", getMentors);
router.get("/:id", getMentor);
router.post("/", createMentor); /// will be role update so, it from user
router.patch("/:id", updateMentor);
router.delete("/:id", deleteMentor);

export const mentorRoutes = router;