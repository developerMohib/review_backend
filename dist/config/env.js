"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const schema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
    PORT: zod_1.z.coerce.number().default(4000),
    DATABASE_URL: zod_1.z.string().min(1),
    JWT_SECRET: zod_1.z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    JWT_EXPIRES_SECONDS: zod_1.z.coerce.number().default(86400),
    CLIENT_URL: zod_1.z.string().default("http://localhost:3000"),
    MENTOR_NAME: zod_1.z.string().optional(),
    MENTOR_EMAIL: zod_1.z.string().optional(),
    MENTOR_PASSWORD: zod_1.z.string().optional(),
});
exports.env = schema.parse(process.env);
//# sourceMappingURL=env.js.map