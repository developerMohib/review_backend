import dotenv from "dotenv";
import { Role, MentorStatus } from "../src/db/generated/prisma";
import { PrismaClient } from "../src/db/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
dotenv.config();

let connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  dotenv.config({ override: true });
  connectionString = process.env["DATABASE_URL"];
}
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is missing. Please check your .env file and try again.",
  );
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  console.log("Seeding started...");

  // Reuse existing seed users and preserve their data.
  const [nurjahan, rahim, karim] = await Promise.all([
    prisma.user.findUnique({ where: { email: "nurjahan@example.com" } }).then(
      (user) => user ?? prisma.user.create({
        data: {
          name: "Nurjahan Sir",
          email: "nurjahan@example.com",
          password: "hashed_password_123",
          role: Role.MENTOR,
          phone: "+8801700000001",
          bio: "Senior software engineer and mentor",
        },
      }),
    ),
    prisma.user.findUnique({ where: { email: "rahim@example.com" } }).then(
      (user) => user ?? prisma.user.create({
        data: {
          name: "Rahim Uddin",
          email: "rahim@example.com",
          password: "hashed_password_123",
          role: Role.STUDENT,
          phone: "+8801700000002",
        },
      }),
    ),
    prisma.user.findUnique({ where: { email: "karim@example.com" } }).then(
      (user) => user ?? prisma.user.create({
        data: {
          name: "Karim Ahmed",
          email: "karim@example.com",
          password: "hashed_password_123",
          role: Role.MENTOR,
          phone: "+8801700000003",
          bio: "Full-stack developer and career mentor",
        },
      }),
    ),
  ]);

  const nurjahanMentor = await prisma.mentor.findUnique({
    where: { userId: nurjahan.id },
  });
  if (!nurjahanMentor) {
    await prisma.mentor.create({
      data: {
        userId: nurjahan.id,
        expertise: ["Node.js", "TypeScript", "PostgreSQL"],
        experience: 6,
        hourlyRate: 25,
        availability: "Saturday to Wednesday, 7 PM - 10 PM",
        status: MentorStatus.APPROVED,
        rating: 4.8,
        totalSessions: 120,
      },
    });
  }

  const karimMentor = await prisma.mentor.findUnique({
    where: { userId: karim.id },
  });
  if (!karimMentor) {
    await prisma.mentor.create({
      data: {
        userId: karim.id,
        expertise: ["React", "Next.js", "Express"],
        experience: 4,
        hourlyRate: 20,
        availability: "Friday and Saturday, 10 AM - 1 PM",
        status: MentorStatus.PENDING,
        rating: 4.5,
        totalSessions: 45,
      },
    });
  }

  console.log("Seeding completed successfully.");
  console.log("Created users:", {
    nurjahan: nurjahan.id,
    rahim: rahim.id,
    karim: karim.id,
  });
}

main()
  .catch((error: unknown) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
