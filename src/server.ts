import app from "./index.js";
import { prisma } from "./db/prisma.js";

const port = Number(process.env.PORT) || 4000;

async function main() {
  try {
    await prisma.$connect();
    console.log("Neon PostgreSQL connected successfully.");

    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`Admin app listening on port ${port}`);
    });

    const shutdown = async (signal: string) => {
      console.log(`${signal} received, shutting down...`);
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
      // atke gele 10s por force exit
      setTimeout(() => process.exit(1), 10_000).unref();
    };

    process.on("SIGTERM", () => void shutdown("SIGTERM"));
    process.on("SIGINT", () => void shutdown("SIGINT"));
  } catch (error) {
    console.error("Failed to start the server:", error);
    await prisma.$disconnect().catch(() => {});
    process.exit(1);
  }
}

void main();