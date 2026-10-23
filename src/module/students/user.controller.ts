import type { Request, Response } from "express";

import { AppError } from "../../utils/AppError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

import {
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
} from "./user.service.js";
import { updateUserSchema } from "./user.validator.js";

// import { updateUserSchema } from "./user.validator.js";

// Shared route-parameter check.
const getUserId = (req: Request): string => {
  const id = req.params.id;

  if (typeof id !== "string" || !id.trim()) {
    throw new AppError("User id is required", 400);
  }

  return id.trim();
};

export const getAllUsersController = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const users = await getAllUsersService();

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  },
);

export const getUserByIdController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = getUserId(req);

    const user = await getUserByIdService(id);

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  },
);

export const updateUserController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = getUserId(req);

    const validatedInput = updateUserSchema.parse(req.body);

    const user = await updateUserService(id, validatedInput);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  },
);

export const deleteUserController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = getUserId(req);

    await deleteUserService(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  },
);