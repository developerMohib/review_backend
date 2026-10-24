import { Router } from "express";
import { createSubmissionController, getAllSubmissionsController, getMySubmissionsController } from "./submission.controller";
import { authenticate } from "../../middlewares/auth";

const router = Router();

router.post("/",authenticate, createSubmissionController);
router.get("/my", authenticate, getMySubmissionsController);
router.get("/all",authenticate, getAllSubmissionsController);
// router.get("/:id", getUserByIdController);

// router.patch("/:id", updateUserController);

export const submissionRoutes = router;
