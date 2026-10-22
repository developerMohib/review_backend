import type { Request, Response } from "express";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "./user.service";
import { AppError } from "../../utils/AppError";

export const getTotalUsers = async (req: Request, res: Response) => {
  const users = await getAllUsers();
  res.json({ success: true, data: users });
};

export const getOneUser = async (req: Request, res: Response) => {
  const user = await getUserById(req.params.id as string);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json({ success: true, data: user });
};

export const createNewUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, avatar, bio } = req.body;

  if (!name || !email || !password) {
    throw new AppError("name, email and password are required", 400);
  }

  // role body theke neya hocche na: sobai STUDENT hishebe shuru hobe
  const user = await createUser({
    name,
    email,
    password,
    phone,
    avatar,
    bio,
  });

  res.status(201).json({ success: true, data: user });
};

export const updateExistUser = async (req: Request, res: Response) => {
  const { name, phone, avatar, bio, isActive } = req.body;

  const user = await updateUser(req.params.id as string, {
    name,
    phone,
    avatar,
    bio,
    isActive,
  });

  res.json({ success: true, data: user });
};

export const deleteExistUser = async (req: Request, res: Response) => {
  await deleteUser(req.params.id as string);
  res.json({ success: true, message: "User deleted successfully" });
};