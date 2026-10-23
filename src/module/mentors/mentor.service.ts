import { Prisma } from "../../db/generated/prisma/client";
import { MentorStatus } from "../../db/generated/prisma/enums";
import { prisma } from "../../db/prisma";
import { AppError } from "../../utils/AppError";

export interface CreateMentorInput {
  userId: string;
  expertise: string[];
  experience?: number | undefined;
  hourlyRate?: number | undefined;
  availability?: string | undefined;
}

export interface UpdateMentorInput {
  expertise?: string[] | undefined;
  experience?: number | undefined;
  hourlyRate?: number | undefined;
  availability?: string | undefined;
  status?: MentorStatus | undefined;
}

// user er je field gulo mentor er shathe dekhano hobe (password nai)
const mentorUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  avatar: true,
  bio: true,
} as const;

const handlePrismaError = (error: unknown): never => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new AppError("This user already has a mentor profile", 409);
    }
    if (error.code === "P2003") {
      throw new AppError("User not found", 404);
    }
    if (error.code === "P2025") {
      throw new AppError("Mentor not found", 404);
    }
  }
  throw error;
};

export const getAllMentors = () => {
  return prisma.mentor.findMany({
    include: { user: { select: mentorUserSelect } },
    orderBy: { createdAt: "desc" },
  });
};

export const getMentorById = (id: string) => {
  console.log('id ser',id)
  return prisma.mentor.findUnique({
    where: { id },
    include: { user: { select: mentorUserSelect } },
  });
};

export const createNewMentor = async (input: CreateMentorInput) => {
  try {
    return await prisma.mentor.create({
      data: {
        userId: input.userId,
        expertise: input.expertise,
        ...(input.experience !== undefined && { experience: input.experience }),
        ...(input.hourlyRate !== undefined && { hourlyRate: input.hourlyRate }),
        ...(input.availability !== undefined && { availability: input.availability }),
      },
      include: { user: { select: mentorUserSelect } },
    });
  } catch (error) {
    return handlePrismaError(error);
  }
};

export const updateAMentor = async (id: string, input: UpdateMentorInput) => {
  try {
    return await prisma.mentor.update({
      where: { id },
      data: {
        ...(input.expertise !== undefined && { expertise: input.expertise }),
        ...(input.experience !== undefined && { experience: input.experience }),
        ...(input.hourlyRate !== undefined && { hourlyRate: input.hourlyRate }),
        ...(input.availability !== undefined && { availability: input.availability }),
        ...(input.status !== undefined && { status: input.status }),
      },
      include: { user: { select: mentorUserSelect } },
    });
  } catch (error) {
    return handlePrismaError(error);
  }
};

export const deleteAMentor = async (id: string) => {
  try {
    await prisma.mentor.delete({ where: { id } });
  } catch (error) {
    handlePrismaError(error);
  }
};