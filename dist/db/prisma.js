import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from './generated/prisma/client.js';
import { PrismaNeon } from '@prisma/adapter-neon';
let databaseUrl = process.env["DATABASE_URL"];
if (!databaseUrl) {
    dotenv.config({ override: true });
    databaseUrl = process.env["DATABASE_URL"];
}
if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing. Please check your .env file and try again.");
}
const adapter = new PrismaNeon({
    connectionString: databaseUrl,
});
export const prisma = new PrismaClient({ adapter });
//# sourceMappingURL=prisma.js.map