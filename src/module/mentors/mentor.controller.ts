import type { Request, Response } from "express";
import { MentorStatus } from "../../db/generated/prisma";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  createMentorService,
  deleteMentorService,
  getAllMentorsService,
  getMentorByIdService,
  updateMentorService,
} from "./mentor.service.js";
import { AppError } from "../../utils/AppError.js";

const isNonEmptyStringArray = (
  value: unknown,
): value is string[] =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.every(
    (item) =>
      typeof item === "string" &&
      item.trim().length > 0,
  );

const isNonNegativeNumber = (
  value: unknown,
): value is number =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  value >= 0;

const isMentorStatus = (
  value: unknown,
): value is MentorStatus =>
  typeof value === "string" &&
  Object.values(MentorStatus).some(
    (status) => status === value,
  );

const getMentorId = (req: Request): string => {
  const id = req.params.id;

  if (typeof id !== "string" || !id.trim()) {
    throw new AppError("Mentor id is required", 400);
  }

  return id.trim();
};

const getRequestBody = (
  body: unknown,
): Record<string, unknown> => {
  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body)
  ) {
    throw new AppError("Request body must be an object", 400);
  }

  return body as Record<string, unknown>;
};

// GET all mentors

export const getAllMentorsController = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const mentors = await getAllMentorsService();

    res.status(200).json({
      success: true,
      message: "Mentors fetched successfully",
      data: mentors,
    });
  },
);

// GET one mentor

export const getMentorByIdController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = getMentorId(req);

    const mentor = await getMentorByIdService(id);

    res.status(200).json({
      success: true,
      message: "Mentor fetched successfully",
      data: mentor,
    });
  },
);

// CREATE mentor

export const createMentorController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const {
      userId,
      expertise,
      experience,
      hourlyRate,
      availability,
    } = getRequestBody(req.body);

    if (typeof userId !== "string" || !userId.trim()) {
      throw new AppError("userId is required", 400);
    }

    if (!isNonEmptyStringArray(expertise)) {
      throw new AppError(
        "expertise must be a non-empty array of non-empty strings",
        400,
      );
    }

    if (
      experience !== undefined &&
      !isNonNegativeNumber(experience)
    ) {
      throw new AppError(
        "experience must be a non-negative number",
        400,
      );
    }

    if (
      hourlyRate !== undefined &&
      !isNonNegativeNumber(hourlyRate)
    ) {
      throw new AppError(
        "hourlyRate must be a non-negative number",
        400,
      );
    }

    if (
      availability !== undefined &&
      typeof availability !== "string"
    ) {
      throw new AppError(
        "availability must be a string",
        400,
      );
    }

    const mentor = await createMentorService({
      userId: userId.trim(),
      expertise: expertise.map((item) => item.trim()),
      experience,
      hourlyRate,
      availability:
        availability === undefined
          ? undefined
          : availability.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Mentor created successfully",
      data: mentor,
    });
  },
);

// UPDATE mentor

export const updateMentorController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = getMentorId(req);

    const {
      expertise,
      experience,
      hourlyRate,
      availability,
      status,
    } = getRequestBody(req.body);

    if (
      expertise !== undefined &&
      !isNonEmptyStringArray(expertise)
    ) {
      throw new AppError(
        "expertise must be a non-empty array of non-empty strings",
        400,
      );
    }

    if (
      experience !== undefined &&
      !isNonNegativeNumber(experience)
    ) {
      throw new AppError(
        "experience must be a non-negative number",
        400,
      );
    }

    if (
      hourlyRate !== undefined &&
      !isNonNegativeNumber(hourlyRate)
    ) {
      throw new AppError(
        "hourlyRate must be a non-negative number",
        400,
      );
    }

    if (
      availability !== undefined &&
      typeof availability !== "string"
    ) {
      throw new AppError(
        "availability must be a string",
        400,
      );
    }

    if (
      status !== undefined &&
      !isMentorStatus(status)
    ) {
      throw new AppError(
        "status must be PENDING, APPROVED or REJECTED",
        400,
      );
    }

    if (
      expertise === undefined &&
      experience === undefined &&
      hourlyRate === undefined &&
      availability === undefined &&
      status === undefined
    ) {
      throw new AppError(
        "Provide at least one field to update",
        400,
      );
    }

    const mentor = await updateMentorService(id, {
      expertise:
        expertise === undefined
          ? undefined
          : expertise.map((item) => item.trim()),
      experience,
      hourlyRate,
      availability:
        availability === undefined
          ? undefined
          : availability.trim(),
      status,
    });

    res.status(200).json({
      success: true,
      message: "Mentor updated successfully",
      data: mentor,
    });
  },
);

// DELETE mentor

export const deleteMentorController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = getMentorId(req);

    await deleteMentorService(id);

    res.status(200).json({
      success: true,
      message: "Mentor deleted successfully",
    });
  },
);