import type { Request, Response } from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "./user.service";
import { ZodError } from "zod";

export const getTotalUsers = async (req: Request, res: Response) => {
  try {
     // jara only active status bohon kore
    const users = await getAllUsers();
    res.json({ success: true, data: users });
  } catch (error: any) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        message: errors[0]?.message ?? "Validation failed", // prothom error ta main message
        errors,
      });
    }
  }
};

export const getOneUser = async (req: Request, res: Response) => {
  try {
    // jara only active status bohon kore nahoy no user
    const user = await getUserById(req.params.id as string);
    // pahadar bosate hobe
    res.json({ success: true, data: user });
  } catch (error: any) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        message: errors[0]?.message ?? "Validation failed", // prothom error ta main message
        errors,
      });
    }
  }
};

export const updateExistUser = async (req: Request, res: Response) => {
  try {
    const { name, phone, avatar, bio, isActive } = req.body;
    const user = await updateUser(req.params.id as string, {
      name,
      phone,
      avatar,
      bio,
      isActive,
    });

    res.json({ success: true, data: user });
  } catch (error: any) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        message: errors[0]?.message ?? "Validation failed",
        errors,
      });
    }
  }
};

export const deleteExistUser = async (req: Request, res: Response) => {
  try {
    //status inactive kore dite hobe
    await deleteUser(req.params.id as string);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        message: errors[0]?.message ?? "Validation failed", // prothom error ta main message
        errors,
      });
    }
  }
};
