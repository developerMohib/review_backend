"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = zod_1.z.strictObject({
    name: zod_1.z
        .string()
        .trim()
        .min(2, "Name must contain at least 2 characters.")
        .max(80, "Name must not exceed 80 characters."),
    email: zod_1.z
        .string()
        .trim()
        .toLowerCase()
        .max(254, "Email is too long.")
        .pipe(zod_1.z.email("Enter a valid email address.")),
    password: zod_1.z
        .string().trim()
        .min(6, "Password must contain at least 6 characters.")
        .max(128, "Password must not exceed 128 characters."),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email("Invalid email address"),
    password: zod_1.z.string().trim().min(6, "Password must be at least 6 characters")
});
//# sourceMappingURL=auth.validators.js.map