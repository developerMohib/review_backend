import { Router } from "express";
import { createSubmissionController, getAllSubmissionsController, getMySubmissionsController, updateSubmissionStatusController } from "./submission.controller";
import { authenticate } from "../../middlewares/auth";

const router = Router();

router.post("/",authenticate, createSubmissionController);
router.get("/my", authenticate, getMySubmissionsController);
router.get("/all",authenticate, getAllSubmissionsController);
// router.get("/:id", getUserByIdController);
router.patch(
  "/update/:id",
  authenticate,
  updateSubmissionStatusController
);

export const submissionRoutes = router;
