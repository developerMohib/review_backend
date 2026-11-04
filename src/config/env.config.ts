import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.string(),
  
  PORT: z.coerce.number().default(5000),
  
  DATABASE_URL: z.string().url("Invalid DATABASE_URL format"),
  DIRECT_URL: z.string().url("Invalid DIRECT_URL format").optional(),
  
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long"),
  JWT_EXPIRES_SECONDS: z.coerce.number().default(86400),
  
  CLIENT_URL: z.string().url("Invalid CLIENT_URL format"),
  SERVER_URL: z.string().url("Invalid SERVER_URL format"),
  
  MENTOR_NAME: z.string().min(2, "MENTOR_NAME is required"),
  MENTOR_EMAIL: z.string().email("Invalid MENTOR_EMAIL format"),
  MENTOR_PASSWORD: z.string().min(6, "MENTOR_PASSWORD must be at least 6 characters long"),
});


const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:");
  console.error(parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;