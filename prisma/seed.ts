// import { randomUUID } from "node:crypto";
// import bcrypt from "bcryptjs";

// // Change this import if your Prisma client is exported elsewhere.
// import { prisma } from "../src/db/prisma.js";

// const TOTAL_USERS = 200;
// const TOTAL_MENTORS = 20;
// const TOTAL_SUBMISSIONS = 200;

// const PASSWORD = process.env.SEED_PASSWORD;

// const firstNames = [
//   "Rahim",
//   "Karim",
//   "Sabbir",
//   "Tanvir",
//   "Nusrat",
//   "Ayesha",
//   "Fatima",
//   "Sadia",
//   "Hasan",
//   "Imran",
//   "Arif",
//   "Mehedi",
//   "Sakib",
//   "Nabila",
//   "Sumaiya",
//   "Farhan",
//   "Adnan",
//   "Jannat",
//   "Rafi",
//   "Tamanna",
// ];

// const lastNames = [
//   "Ahmed",
//   "Hossain",
//   "Islam",
//   "Rahman",
//   "Khan",
//   "Chowdhury",
//   "Hasan",
//   "Mahmud",
//   "Akter",
//   "Sultana",
// ];

// const projectNames = [
//   "E-Commerce Platform",
//   "Student Management System",
//   "Task Management App",
//   "Online Learning Platform",
//   "Job Portal",
//   "Expense Tracker",
//   "Blog Application",
//   "Food Delivery App",
//   "Hospital Management System",
//   "Inventory Management System",
//   "Real Estate Platform",
//   "Weather Dashboard",
//   "Chat Application",
//   "Portfolio Website",
//   "Event Booking System",
//   "Library Management System",
//   "Fitness Tracking App",
//   "Social Media Dashboard",
//   "Travel Booking Platform",
//   "Project Management Tool",
// ];

// const categories = [
//   "Web Development",
//   "Full Stack",
//   "Frontend",
//   "Backend",
//   "E-Commerce",
//   "Dashboard",
// ];

// const expertiseOptions = [
//   "React",
//   "Next.js",
//   "TypeScript",
//   "Node.js",
//   "Express.js",
//   "PostgreSQL",
//   "Prisma",
//   "MongoDB",
//   "REST API",
//   "Full Stack Development",
// ];

// const mentorMotivations = [
//   "I enjoy helping students become confident developers.",
//   "I want to help beginners build practical projects.",
//   "I enjoy reviewing code and sharing industry best practices.",
//   "I want to help students improve their problem-solving skills.",
//   "I am passionate about teaching modern web development.",
// ];

// const getName = (index: number): string => {
//   const first = firstNames[index % firstNames.length];
//   const last =
//     lastNames[Math.floor(index / firstNames.length) % lastNames.length];

//   return `${first} ${last}`;
// };

// const getDate = (daysAgo: number): Date => {
//   return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
// };

// async function seedDatabase() {
//   console.log("Starting Neon database seeding...");

//   // Prevent accidental duplicate data when running the seed again.
//   const existingUser = await prisma.user.findUnique({
//     where: {
//       email: "dummy.admin@example.com",
//     },
//   });

//   if (existingUser) {
//     throw new Error(
//       "Dummy data already exists. Remove the existing dummy records before running this seed again.",
//     );
//   }

//   if (!PASSWORD) throw new Error("SEED_PASSWORD must be set");
//   const hashedPassword = await bcrypt.hash(PASSWORD, 10);

//   // --------------------------------------------------
//   // 1. CREATE 200 USERS
//   // 179 students + 20 mentors + 1 admin
//   // --------------------------------------------------

//   const students = Array.from({ length: 179 }, (_, index) => ({
//     id: randomUUID(),
//     name: getName(index),
//     email: `dummy.student.${String(index + 1).padStart(3, "0")}@example.com`,
//     password: hashedPassword,
//     role: "student" as const,
//     phone: `+880170000${String(index + 1).padStart(4, "0")}`,
//     bio: `Student interested in web development and software engineering. Student number ${index + 1}.`,
//     isActive: true,
//     createdAt: getDate(180 - index),
//     updatedAt: new Date(),
//   }));

//   const mentors = Array.from({ length: TOTAL_MENTORS }, (_, index) => ({
//     id: randomUUID(),
//     name: getName(index + 179),
//     email: `dummy.mentor.${String(index + 1).padStart(3, "0")}@example.com`,
//     password: hashedPassword,
//     role: "mentor" as const,
//     phone: `+880180000${String(index + 1).padStart(4, "0")}`,
//     bio: `Experienced web development mentor number ${index + 1}.`,
//     isActive: true,
//     createdAt: getDate(150 - index),
//     updatedAt: new Date(),
//   }));

//   const admin = {
//     id: randomUUID(),
//     name: "Demo Administrator",
//     email: "dummy.admin@example.com",
//     password: hashedPassword,
//     role: "admin" as const,
//     phone: "+8801900000001",
//     bio: "Demo administrator account.",
//     isActive: true,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   };

//   const allUsers = [...students, ...mentors, admin];

//   await prisma.user.createMany({
//     data: allUsers,
//   });

//   console.log(`Created ${TOTAL_USERS} users.`);

//   // --------------------------------------------------
//   // 2. CREATE 20 MENTOR PROFILES
//   // --------------------------------------------------

//   const mentorProfiles = mentors.map((mentor, index) => ({
//     id: randomUUID(),
//     userId: mentor.id,
//     expertise: [
//       expertiseOptions[index % expertiseOptions.length],
//       expertiseOptions[(index + 3) % expertiseOptions.length],
//       expertiseOptions[(index + 5) % expertiseOptions.length],
//     ],
//     experience: 1 + (index % 8),
//     motivation: mentorMotivations[index % mentorMotivations.length],
//     status: (
//       index % 3 === 0
//         ? "pending"
//         : index % 3 === 1
//           ? "approved"
//           : "rejected"
//     ) as "pending" | "approved" | "rejected",
//     reviewedById: null,
//     reviewedAt: null,
//     createdAt: getDate(100 - index),
//     updatedAt: new Date(),
//   }));

//   await prisma.mentor.createMany({
//     data: mentorProfiles,
//   });

//   console.log(`Created ${TOTAL_MENTORS} mentor profiles.`);

//   // --------------------------------------------------
//   // 3. CREATE 200 SUBMISSIONS
//   // --------------------------------------------------

//   const submissions = Array.from(
//     { length: TOTAL_SUBMISSIONS },
//     (_, index) => {
//       const studentIndex = index % students.length;
//       const student = students[studentIndex];

//       // Every student gets an initial submission.
//       // Additional submissions are always approved/rejected,
//       // so no student has multiple pending submissions.
//       let status: "pending" | "approved" | "rejected";

//       if (index < students.length) {
//         const statusIndex = index % 4;

//         status =
//           statusIndex === 0
//             ? "pending"
//             : statusIndex === 1
//               ? "approved"
//               : statusIndex === 2
//                 ? "rejected"
//                 : "approved";
//       } else {
//         status = index % 2 === 0 ? "approved" : "rejected";
//       }

//       const projectName = projectNames[index % projectNames.length];
//       const number = String(index + 1).padStart(3, "0");

//       // Approved/rejected submissions have a review date and reviewer.
//       const mentorIndex = index % mentors.length;
//       const shouldBeReviewed = status !== "pending";

//       return {
//         id: randomUUID(),
//         projectName: `${projectName} ${number}`,
//         category: categories[index % categories.length],
//         repoUrl: `https://github.com/dummy-submissions/project-${number}`,
//         liveUrl: `https://project-${number}.example.com`,
//         description:
//           `This is dummy submission ${number}. ` +
//           `The project demonstrates ${projectName.toLowerCase()} ` +
//           "functionality, responsive design, API integration, " +
//           "and database operations.",
//         status,
//         userId: student.id,
//         reviewedById: shouldBeReviewed ? mentors[mentorIndex].id : null,
//         reviewedAt: shouldBeReviewed
//           ? getDate(index % 30)
//           : null,
//         createdAt: getDate(index % 60),
//         updatedAt: new Date(),
//       };
//     },
//   );

//   await prisma.submission.createMany({
//     data: submissions,
//   });

//   console.log(`Created ${TOTAL_SUBMISSIONS} submissions.`);

//   console.log("\nDatabase seeding completed successfully!");
//   console.log("----------------------------------------");
//   console.log("Total users:       200");
//   console.log("  Students:        179");
//   console.log("  Mentors:          20");
//   console.log("  Admins:            1");
//   console.log("Mentor profiles:   20");
//   console.log("Submissions:       200");
//   console.log("----------------------------------------");
// }

// seedDatabase()
//   .catch((error: unknown) => {
//     console.error("Database seeding failed:", error);
//     process.exitCode = 1;
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });