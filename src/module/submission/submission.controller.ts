import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { createSubmissionService, getAllSubmissionsService, getMySubmissionsService } from "./submission.service";
import { createSubmissionSchema } from "./submission.validation";
import { AuthRequest } from "../../middlewares/auth";

export const createSubmissionController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user?.id || (req as any).auth?.userId;
    console.log('user' ,userId)
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found in request",
      });
      return
    }
    console.log('req.bosy',req.body)
    const input = createSubmissionSchema.parse(req.body);

    const submission = await createSubmissionService(userId, input);

    res.status(201).json({
      success: true,
      message: "Project submitted successfully and is pending review.",
      data: submission,
    });
    return
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

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string | undefined;

    const result = await getMySubmissionsService(
      userId,
      page,
      limit,
      status
    );

    res.status(200).json({
      success: true,
      message: "My submissions fetched successfully",
      data: result,
    });
    return;
  }
);


export const getAllSubmissionsController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found in request",
      });
      return;
    }

    // Query parameters from frontend (with defaults)
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string | undefined; 

    const result = await getAllSubmissionsService(page, limit, status);

    res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      data: result,
    });
  }
);