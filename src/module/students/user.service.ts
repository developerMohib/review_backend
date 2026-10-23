import { prisma } from "../../db/prisma.js";
import { AppError } from "../../utils/AppError.js";
import type { UpdateUserInput } from "./user.validator.js";

export const getAllUsersService = async () => {
  return prisma.user.findMany({
    omit: {
      password: true,
    },
    include: {
      mentorProfile: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getUserByIdService = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    omit: {
      password: true,
    },
    include: {
      mentorProfile: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const updateUserService = async (id: string, input: UpdateUserInput) => {
  return prisma.user.update({
    where: { id },

    data: {
      ...(input.name !== undefined && {
        name: input.name,
      }),

      ...(input.phone !== undefined && {
        phone: input.phone,
      }),

      ...(input.avatar !== undefined && {
        avatar: input.avatar,
      }),

      ...(input.bio !== undefined && {
        bio: input.bio,
      }),

      ...(input.isActive !== undefined && {
        isActive: input.isActive,
      }),
    },

    omit: {
      password: true,
    },

    include: {
      mentorProfile: true,
    },
  });
};

export const deleteUserService = async (id: string): Promise<void> => {
  await prisma.user.update({
    where: { id },
    data: {
      isActive: false,
    },
  });
};
