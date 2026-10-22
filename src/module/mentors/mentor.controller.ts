import type { Request, Response } from "express";
import { createNewMentor, deleteAMentor, getAllMentors, getMentorById, updateAMentor } from "./mentor.service";
import { AppError } from "../../utils/AppError";
import { MentorStatus } from "../../db/generated/prisma/enums";

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const isNonNegativeNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

export const getMentors = async (req: Request, res: Response) => {
  const mentors = await getAllMentors();
  res.json({ success: true, data: mentors });
};

export const getMentor = async (req: Request, res: Response) => {
  const mentor = await getMentorById(req.params.id as string);
console.log(' id', req.params.id)
  if (!mentor) {
    throw new AppError("Mentor not found", 404);
  }

  res.json({ success: true, data: mentor });
};

export const createMentor = async (req: Request, res: Response) => {
  const { userId, expertise, experience, hourlyRate, availability } = req.body;

  if (typeof userId !== "string" || !userId) {
    throw new AppError("userId is required", 400);
  }
  if (!isStringArray(expertise) || expertise.length === 0) {
    throw new AppError("expertise must be a non-empty array of strings", 400);
  }
  if (experience !== undefined && !isNonNegativeNumber(experience)) {
    throw new AppError("experience must be a non-negative number", 400);
  }
  if (hourlyRate !== undefined && !isNonNegativeNumber(hourlyRate)) {
    throw new AppError("hourlyRate must be a non-negative number", 400);
  }

  // status body theke neya hocche na: notun mentor shobsomoy PENDING
  const mentor = await createNewMentor({
    userId,
    expertise,
    experience,
    hourlyRate,
    availability,
  });

  res.status(201).json({ success: true, data: mentor });
};

export const updateMentor = async (req: Request, res: Response) => {
  const { expertise, experience, hourlyRate, availability, status } = req.body;

  if (expertise !== undefined && !isStringArray(expertise)) {
    throw new AppError("expertise must be an array of strings", 400);
  }
  if (experience !== undefined && !isNonNegativeNumber(experience)) {
    throw new AppError("experience must be a non-negative number", 400);
  }
  if (hourlyRate !== undefined && !isNonNegativeNumber(hourlyRate)) {
    throw new AppError("hourlyRate must be a non-negative number", 400);
  }
  if (status !== undefined && !Object.values(MentorStatus).includes(status)) {
    throw new AppError("status must be PENDING, APPROVED or REJECTED", 400);
  }

  const mentor = await updateAMentor(req.params.id as string, {
    expertise,
    experience,
    hourlyRate,
    availability,
    status,
  });

  res.json({ success: true, data: mentor });
};

export const deleteMentor = async (req: Request, res: Response) => {
  await deleteAMentor(req.params.id as string);
  res.json({ success: true, message: "Mentor deleted successfully" });
};