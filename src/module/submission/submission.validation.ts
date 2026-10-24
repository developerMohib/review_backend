import { z } from "zod";

const normalizeUrl = (v: string) =>
  v.trim().toLowerCase().replace(/\.git$/, "").replace(/\/+$/, "");

export const createSubmissionSchema = z.object({
  projectName: z.string().trim().min(3).max(100),
  repoUrl: z.string().trim().url().transform(normalizeUrl),
  liveUrl: z.string().trim().url().optional().or(z.literal("")),
  description: z.string().trim().min(20).max(1000),
  category: z.string().trim()
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;