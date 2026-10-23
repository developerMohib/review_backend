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

// Explicitly select public user fields.
const mentorUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  avatar: true,
  bio: true,
} as const;

// GET all mentors
export const getAllMentorsService = async () => {
  return prisma.mentor.findMany({
    include: {
      user: {
        select: mentorUserSelect,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// GET one mentor
export const getMentorByIdService = async (id: string) => {
  const mentor = await prisma.mentor.findUnique({
    where: { id },
    include: {
      user: {
        select: mentorUserSelect,
      },
    },
  });

  if (!mentor) {
    throw new AppError("Mentor not found", 404);
  }

  return mentor;
};

// CREATE mentor
export const createMentorService = async (
  input: CreateMentorInput,
) => {
  return prisma.mentor.create({
    data: {
      userId: input.userId,
      expertise: input.expertise,
      status: "PENDING",

      ...(input.experience !== undefined && {
        experience: input.experience,
      }),

      ...(input.hourlyRate !== undefined && {
        hourlyRate: input.hourlyRate,
      }),

      ...(input.availability !== undefined && {
        availability: input.availability,
      }),
    },

    include: {
      user: {
        select: mentorUserSelect,
      },
    },
  });
};

// UPDATE mentor
export const updateMentorService = async (
  id: string,
  input: UpdateMentorInput,
) => {
  return prisma.mentor.update({
    where: { id },

    data: {
      ...(input.expertise !== undefined && {
        expertise: input.expertise,
      }),

      ...(input.experience !== undefined && {
        experience: input.experience,
      }),

      ...(input.hourlyRate !== undefined && {
        hourlyRate: input.hourlyRate,
      }),

      ...(input.availability !== undefined && {
        availability: input.availability,
      }),

      ...(input.status !== undefined && {
        status: input.status,
      }),
    },

    include: {
      user: {
        select: mentorUserSelect,
      },
    },
  });
};

// DELETE mentor
export const deleteMentorService = async (
  id: string,
): Promise<void> => {
  await prisma.mentor.delete({
    where: { id },
  });
};