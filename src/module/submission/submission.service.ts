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

export const getMySubmissionsService = async (
  userId: string,
  page: number,
  limit: number,
  status?: string
) => {
  const currentPage = Math.max(1, page);
  const pageSize = Math.max(1, Math.min(limit, 50));
  const skip = (currentPage - 1) * pageSize;

  const where = {
    userId,
    ...(status ? { status: status as SubmissionStatus } : {}),
  };

  const [submissions, total] = await Promise.all([
    prisma.submission.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.submission.count({ where }),
  ]);

  return {
    submissions,
    pagination: {
      total,
      page: currentPage,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

export const getAllSubmissionsService = async (page: number, limit: number, status?: string) => {
  try {
    const skip = (page - 1) * limit;
    const whereClause: any = {};

    if (status) {
      whereClause.status = status; 
    }

    const [submissions, totalCount] = await Promise.all([
      prisma.submission.findMany({
        where: whereClause,
        skip,
        take: limit,
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
      }),
      prisma.submission.count({
        where: whereClause,
      }),
    ]);

    // Stats calculation
    const statsData = await prisma.submission.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    const stats = { total: 0, pending: 0, approved: 0, rejected: 0 };
    statsData.forEach((s) => {
      const count = s._count.status;
      stats.total += count;
      
      const lowerStatus = s.status.toLowerCase();
      if (lowerStatus === 'pending') stats.pending = count;
      else if (lowerStatus === 'approved') stats.approved = count;
      else if (lowerStatus === 'rejected') stats.rejected = count;
    });

    return {
      submissions,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      stats,
    };
  } catch (error) {
    console.error("❌ Database Error in getAllSubmissionsService:", error);
    throw error; 
  }
};