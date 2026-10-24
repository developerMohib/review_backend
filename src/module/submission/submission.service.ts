import { SubmissionStatus } from "../../../generated/prisma";
import { prisma } from "../../db/prisma";
import { AppError } from "../../utils/AppError";
import { CreateSubmissionInput } from "./submission.validation";

export const createSubmissionService = async (
  userId: string,
  input: CreateSubmissionInput,
) => {
  // ১. Duplicate Submission Prevention (PDF Requirement)
  const existingPendingSubmission = await prisma.submission.findFirst({
    where: {
      userId: userId,
      status: SubmissionStatus.pending,
    },
  });

  if (existingPendingSubmission) {
    throw new AppError("You already have a pending submission. Please wait for the mentor's review before submitting a new one.");
  }

  // ২. Secure Data Creation
  const newSubmission = await prisma.submission.create({
    data: {
      projectName: input.projectName,
      category: input.category ||null,
      repoUrl: input.repoUrl,
      liveUrl: input.liveUrl || "",
      description: input.description,
      status: SubmissionStatus.pending,
      userId: userId,
    },
  });

  return newSubmission;
};

export const getMySubmissionsService = async (userId: string) => {
  return prisma.submission.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const getAllSubmissionsService = async () => {
  return prisma.submission.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};