
import { prisma } from "../../db/prisma";
import { handlePrismaError } from "../../utils/handleCustomPrismaErr";
import { UpdateUserInput } from "./user.validator";


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
