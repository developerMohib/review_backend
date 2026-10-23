import { Router } from "express";
import {
  getAllMentorsController,
  getMentorByIdController,
  createMentorController,
  updateMentorController,
  deleteMentorController,
} from "./mentor.controller.js";
const router = Router();

router.get("/", getAllMentorsController);
router.get("/:id", getMentorByIdController);
router.post("/", createMentorController); /// will be role update so, it from user
router.patch("/:id", updateMentorController);
router.delete("/:id", deleteMentorController);

export const mentorRoutes = router;