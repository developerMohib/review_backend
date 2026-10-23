"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = void 0;
const zod_1 = require("zod");
exports.updateUserSchema = zod_1.z
    .strictObject({
    name: zod_1.z
        .string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(80, "Name must not exceed 80 characters")
        .optional(),
    phone: zod_1.z
        .string()
        .trim()
        .regex(/^\+?[0-9]{7,15}$/, "Phone must contain 7–15 digits with an optional leading +")
        .optional(),
    avatar: zod_1.z
        .string()
        .trim()
        .max(2048, "Avatar URL is too long")
        .pipe(zod_1.z.url({
        protocol: /^https?$/,
        error: "Avatar must be a valid HTTP or HTTPS URL",
    }))
        .optional(),
    bio: zod_1.z
        .string()
        .trim()
        .max(1000, "Bio must not exceed 1000 characters")
        .optional(),
    isActive: zod_1.z.boolean().optional(),
})
    .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Provide at least one field to update",
});
//# sourceMappingURL=user.validator.js.map