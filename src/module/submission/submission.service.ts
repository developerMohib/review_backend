import { prisma } from "../../db/prisma";
import { AppError } from "../../utils/AppError";

export const createSubmission = async (userId: string, data: any) => {
  const existingPending = await prisma.submission.findFirst({
    where: {
      userId: userId,
      status: 'pending',
    },
  });

  if (existingPending) {
    throw new AppError("You already have a pending submission. Please wait for mentor review.", 400);
  }

  // ২. নতুন সাবমিশন তৈরি
  const submission = await prisma.submission.create({
    data: {
      ...data,
      userId,
      status: 'pending',
    },
  });

  return submission;
};