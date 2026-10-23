// login korte hoile db table user collection thek check korbo, is ative only

import { Request, Response } from "express";
import { loginSchema, registerUserSchema } from "./auth.validators";
import { registerService, loginService } from "./auth.services";
import { asyncHandler } from "../../utils/asyncHandler";

export const registerController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validatedInput = registerUserSchema.parse(req.body);

    const newStudent = await registerService(validatedInput);

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: newStudent,
    });
  },
);
export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = loginSchema.parse(req.body);
    const { token, user } = await loginService(
      validatedData.email,
      validatedData.password,
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ৪. Success Response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user, token },
    });
  },
);

export const logoutUser = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  },
);
