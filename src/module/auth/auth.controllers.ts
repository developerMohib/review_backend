// login korte hoile db table user collection thek check korbo, is ative only

import { Request, Response } from "express";
import {
  loginSchema,
  RegisterInput,
  registerUserSchema,
} from "./auth.validators";
import { createStudentService, loginService } from "./auth.services";
import { ZodError } from "zod";

export const registerController = async (req: Request, res: Response) => {
  try {
    const validateInput: RegisterInput = registerUserSchema.parse(req.body);
    const newStudent = await createStudentService(validateInput);
    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: newStudent,
    });
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
    if (error.message === "Email already registered") {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
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

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user, token },
    });
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
    if (error.message === "Invalid email or password") {
      return res.status(401).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    // HTTP-Only Cookie ক্লিয়ার করা
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/", // যেই path এ সেট করা হয়েছিল, সেখানেই ক্লিয়ার করতে হবে
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};
