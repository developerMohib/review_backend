import { z } from 'zod';
import { Role } from '../../../generated/prisma';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: Role | undefined;
  phone?: string | undefined;
  avatar?: string | undefined;
  bio?: string | undefined;
  isActive?: boolean | undefined;
}

export interface UpdateUserInput {
  name?: string | undefined;
  phone?: string | undefined;
  avatar?: string | undefined;
  bio?: string | undefined;
  isActive?: boolean | undefined;
}

export const registerUserSchema = z.strictObject({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters.")
    .max(80, "Name must not exceed 80 characters."),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, "Email is too long.")
    .pipe(z.email("Enter a valid email address.")),

  password: z
    .string().trim()
    .min(6, "Password must contain at least 6 characters.")
    .max(128, "Password must not exceed 128 characters."),
});

export type RegisterInput = z.infer<typeof registerUserSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().trim().min(6, "Password must be at least 6 characters")
});