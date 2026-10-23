// login korte hoile db table user collection thek check korbo, is ative only
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../db/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { CreateUserInput } from "./auth.validators.js";
import { handlePrismaError } from "../../utils/handleCustomPrismaErr.js";

export const createStudentService = async (input: CreateUserInput) => {
  const hashedPassword = await bcrypt.hash(input.password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase().trim(),
        password: hashedPassword,
        role: input.role || "STUDENT",
        isActive: input.isActive !== undefined ? input.isActive : true,
        phone: input.phone || null,
        avatar: input.avatar || null,
        bio: input.bio || null,
      },
      omit: {
        password: true,
      },
    });

    return newUser;
  } catch (error: any) {
    return handlePrismaError(error);
  }
};

export const loginService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  // inactive user hole "not found" dibe
  if (!user.isActive) {
    throw new AppError("User not found", 404);
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }

  const token = jwt.sign({ id: user.id, role: user.role }, secret, {
    expiresIn: "7d",
  });

  const { password: _password, ...userWithoutPassword } = user;

  return { token, user: userWithoutPassword };
};
