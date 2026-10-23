"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = __importDefault(require("./index.js"));
const prisma_js_1 = require("./db/prisma.js");
const port = Number(process.env.PORT) || 4000;
async function main() {
    try {
        await prisma_js_1.prisma.$connect();
        console.log("Neon PostgreSQL connected successfully.");
        const server = index_js_1.default.listen(port, "0.0.0.0", () => {
            console.log(`Admin app listening on port ${port}`);
        });
        const shutdown = async (signal) => {
            console.log(`${signal} received, shutting down...`);
            server.close(async () => {
                await prisma_js_1.prisma.$disconnect();
                process.exit(0);
            });
            // atke gele 10s por force exit
            setTimeout(() => process.exit(1), 10_000).unref();
        };
        process.on("SIGTERM", () => void shutdown("SIGTERM"));
        process.on("SIGINT", () => void shutdown("SIGINT"));
        process.on("unhandledRejection", (reason) => {
            console.error("Unhandled Rejection:", reason);
        });
    }
    catch (error) {
        console.error("Failed to start the server:", error);
        await prisma_js_1.prisma.$disconnect().catch(() => { });
        process.exit(1);
    }
}
void main();
//# sourceMappingURL=server.js.map