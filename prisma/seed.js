"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = require("../src/db/generated/prisma");
const prisma_2 = require("../src/db/generated/prisma");
const adapter_neon_1 = require("@prisma/adapter-neon");
dotenv_1.default.config();
let connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    dotenv_1.default.config({ override: true });
    connectionString = process.env["DATABASE_URL"];
}
if (!connectionString) {
    throw new Error("DATABASE_URL is missing. Please check your .env file and try again.");
}
const adapter = new adapter_neon_1.PrismaNeon({ connectionString });
const prisma = new prisma_2.PrismaClient({ adapter });
async function main() {
    console.log("Seeding started...");
    // Delete existing seed data.
    // Delete mentors first because they reference users.
    await prisma.mentor.deleteMany();
    await prisma.user.deleteMany();
    // Create users
    const [nurjahan, rahim, karim] = await Promise.all([
        prisma.user.create({
            data: {
                name: "Nurjahan Sir",
                email: "nurjahan@example.com",
                password: "hashed_password_123",
                role: prisma_1.Role.MENTOR,
                phone: "+8801700000001",
                bio: "Senior software engineer and mentor",
            },
        }),
        prisma.user.create({
            data: {
                name: "Rahim Uddin",
                email: "rahim@example.com",
                password: "hashed_password_123",
                role: prisma_1.Role.STUDENT,
                phone: "+8801700000002",
            },
        }),
        prisma.user.create({
            data: {
                name: "Karim Ahmed",
                email: "karim@example.com",
                password: "hashed_password_123",
                role: prisma_1.Role.MENTOR,
                phone: "+8801700000003",
                bio: "Full-stack developer and career mentor",
            },
        }),
    ]);
    // Create mentor profiles
    await prisma.mentor.create({
        data: {
            userId: nurjahan.id,
            expertise: ["Node.js", "TypeScript", "PostgreSQL"],
            experience: 6,
            hourlyRate: 25,
            availability: "Saturday to Wednesday, 7 PM - 10 PM",
            status: prisma_1.MentorStatus.APPROVED,
            rating: 4.8,
            totalSessions: 120,
        },
    });
    await prisma.mentor.create({
        data: {
            userId: karim.id,
            expertise: ["React", "Next.js", "Express"],
            experience: 4,
            hourlyRate: 20,
            availability: "Friday and Saturday, 10 AM - 1 PM",
            status: prisma_1.MentorStatus.PENDING,
            rating: 4.5,
            totalSessions: 45,
        },
    });
    console.log("Seeding completed successfully.");
    console.log("Created users:", {
        nurjahan: nurjahan.id,
        rahim: rahim.id,
        karim: karim.id,
    });
}
main()
    .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map