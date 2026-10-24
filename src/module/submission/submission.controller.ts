import type { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { createSubmissionService, getAllSubmissionsService, getMySubmissionsService } from "./submission.service";
import { createSubmissionSchema } from "./submission.validation";
import type { AuthRequest } from "../../middlewares/auth";
import { AppError } from "../../utils/AppError";
import { Role } from "../../../generated/prisma";

export const createSubmissionController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found in request",
      });
      return;
    }
    const input = createSubmissionSchema.parse(req.body);

    const submission = await createSubmissionService(userId, input);

    res.status(201).json({
      success: true,
      message: "Project submitted successfully and is pending review.",
      data: submission,
    });
    return;
  },
);


export const getMySubmissionsController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
       res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found in request",
      });
      return;
    }

    const submissions = await getMySubmissionsService(userId);

    res.status(200).json({
      success: true,
      message: "My submissions fetched successfully",
      data: submissions,
    });
    return;
  }
);

export const getAllSubmissionsController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== Role.mentor && req.user?.role !== Role.admin) {
      throw new AppError("You are not authorized to view all submissions", 403);
    }

    const submissions = await getAllSubmissionsService();

    res.status(200).json({
      success: true,
      message: "My submissions fetched successfully",
      data: submissions,
    });
    return;
  }
);