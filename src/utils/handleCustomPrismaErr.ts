// Prisma error ke readable AppError e convert kore
import { AppError } from "./AppError";
import { Prisma } from "../db/generated/prisma/client";


export const handlePrismaError = (error: unknown): never => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new AppError("Email already exists", 409);
    }
    if (error.code === "P2025") {
      throw new AppError("User not found", 404);
    }
  }
  throw error;
};