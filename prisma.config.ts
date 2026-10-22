import dotenv from "dotenv";
dotenv.config();
import { defineConfig } from "prisma/config";

let databaseUrl = process.env["DATABASE_URL"];

if (!databaseUrl) {
  dotenv.config({ override: true });
  databaseUrl = process.env["DATABASE_URL"];
}
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is missing. Please check your .env file and try again."
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});