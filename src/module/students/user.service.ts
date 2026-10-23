import bcrypt from "bcryptjs";
import { Role } from "../../db/generated/prisma/enums";
import { Prisma } from "../../db/generated/prisma/client";
import { AppError } from "../../utils/AppError";
import { prisma } from "../../db/prisma";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: Role | undefined;
  phone?: string | undefined;
  avatar?: string | undefined;
  bio?: string | undefined;
}

export interface UpdateUserInput {
  name?: string | undefined;
  phone?: string | undefined;
  avatar?: string | undefined;
  bio?: string | undefined;
  isActive?: boolean | undefined;
}

// Prisma error ke readable AppError e convert kore
const handlePrismaError = (error: unknown): never => {
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

export const getAllUsers = () => {
  return prisma.user.findMany({
    omit: { password: true },
    include: { mentorProfile: true },
    orderBy: { createdAt: "desc" },
  });
};

export const getUserById = (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    omit: { password: true },
    include: { mentorProfile: true },
  });
};

export const createUser = async (input: CreateUserInput) => {
  const hashedPassword = await bcrypt.hash(input.password, 10);

  try {
    return await prisma.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase().trim(),
        password: hashedPassword,
        ...(input.role && { role: input.role }),
        ...(input.phone !== undefined && { phone: input.phone }),
        ...(input.avatar !== undefined && { avatar: input.avatar }),
        ...(input.bio !== undefined && { bio: input.bio }),
      },
      omit: { password: true },
    });
  } catch (error) {
    return handlePrismaError(error);
  }
};

export const updateUser = async (id: string, input: UpdateUserInput) => {
  try {
    return await prisma.user.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.phone !== undefined && { phone: input.phone }),
        ...(input.avatar !== undefined && { avatar: input.avatar }),
        ...(input.bio !== undefined && { bio: input.bio }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
      omit: { password: true },
      include: { mentorProfile: true },
    });
  } catch (error) {
    return handlePrismaError(error);
  }
};

export const deleteUser = async (id: string) => {
  try {
    // Mentor profile auto delete hobe (schema te onDelete: Cascade ache)
    await prisma.user.delete({ where: { id } });
  } catch (error) {
    handlePrismaError(error);
  }
};