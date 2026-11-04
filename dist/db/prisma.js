"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma_1 = require("../../generated/prisma");
const adapter_neon_1 = require("@prisma/adapter-neon");
const env_config_1 = require("../config/env.config");
let databaseUrl = process.env["DATABASE_URL"];
const globalForPrisma = globalThis;
const adapter = new adapter_neon_1.PrismaNeon({
    connectionString: env_config_1.env.DATABASE_URL,
});
exports.prisma = globalForPrisma.prisma ?? new prisma_1.PrismaClient({
    adapter,
    log: env_config_1.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});
if (env_config_1.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = exports.prisma;
}
//# sourceMappingURL=prisma.js.map