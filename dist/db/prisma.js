"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client_js_1 = require("./generated/prisma/client.js");
const adapter_neon_1 = require("@prisma/adapter-neon");
let databaseUrl = process.env["DATABASE_URL"];
if (!databaseUrl) {
    dotenv_1.default.config({ override: true });
    databaseUrl = process.env["DATABASE_URL"];
}
if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing. Please check your .env file and try again.");
}
const adapter = new adapter_neon_1.PrismaNeon({
    connectionString: databaseUrl,
});
exports.prisma = new client_js_1.PrismaClient({ adapter });
//# sourceMappingURL=prisma.js.map