// login korte hoile db table user collection thek check korbo, is ative only
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../db/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { RegisterInput } from "./auth.validators.js";

export const getCurrentUserService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.isActive) {
    throw new AppError(
      "Your account is inactive. Please contact support.",
      403,
    );
  }

  return user;
};



export const registerService = async (input: RegisterInput) => {
  const hashedPassword = await bcrypt.hash(input.password, 10);

  return prisma.user.create({
    data: {
      name: input.name.trim(),
      email: input.email.toLowerCase().trim(),
      password: hashedPassword,

      // Public signup defaults are controlled by the backend.
      role: "student",
      isActive: true,
      phone: null,
      avatar: null,
      bio: null,
    },

    omit: {
      password: true,
    },
  });
};

export const loginService = async (email: string, password: string) => {
 const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AppError("Your account is inactive. Please contact support.", 403);
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError("JWT_SECRET is not configured", 500);
  }

  const token = jwt.sign({ id: user.id, role: user.role }, secret, {
    expiresIn: "7d",
  });

  const { password: _password, ...userWithoutPassword } = user;

  return { token, user: userWithoutPassword };
};
