import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_SECONDS: z.coerce.number().default(86400),
  CLIENT_URL: z.string().default("http://localhost:3000"),
  MENTOR_NAME: z.string().optional(),
  MENTOR_EMAIL: z.string().optional(),
  MENTOR_PASSWORD: z.string().optional(),
});

export const env = schema.parse(process.env);