import app from "./index.js";
import { prisma } from "./db/prisma.js";

const port = Number(process.env.PORT) || 4000;

async function main() {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected successfully.");

    app.listen(port, "0.0.0.0", () => {
      console.log(`Admin app listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
}

main();