import { z } from "zod";
export interface UpdateUserInputField {
  name?: string | undefined;
  phone?: string | undefined;
  avatar?: string | undefined;
  bio?: string | undefined;
  isActive?: boolean | undefined;
}

export const updateUserSchema = z
  .strictObject({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters")
      .max(80, "Name must not exceed 80 characters")
      .optional(),

    phone: z
      .string()
      .trim()
      .regex(
        /^\+?[0-9]{7,15}$/,
        "Phone must contain 7–15 digits with an optional leading +",
      )
      .optional(),

    avatar: z
      .string()
      .trim()
      .max(2048, "Avatar URL is too long")
      .pipe(
        z.url({
          protocol: /^https?$/,
          error: "Avatar must be a valid HTTP or HTTPS URL",
        }),
      )
      .optional(),

    bio: z
      .string()
      .trim()
      .max(1000, "Bio must not exceed 1000 characters")
      .optional(),

    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Provide at least one field to update",
  });

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
