import { Router } from "express";
import { prisma } from "../db/prisma.js";
import bcrypt from "bcryptjs";

const router = Router();

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  phone: true,
  avatar: true,
  bio: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  mentorProfile: true,
} as const;

router.get("/", async (req, res) => {
  const users = await prisma.user.findMany({
    select: safeUserSelect,
  });

  res.json({
    success: true,
    data: users,
  });
});

router.get("/:id", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: safeUserSelect,
  });

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  res.json({
    success: true,
    data: user,
  });
});

router.post("/", async (req, res) => {
  const { name, email, password, role, phone, bio } = req.body;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 12),
      role,
      phone,
      bio,
    },
    select: safeUserSelect,
  });

  res.status(201).json({
    success: true,
    data: user,
  });
});

router.patch("/:id", async (req, res) => {
  const { name, phone, bio, isActive } = req.body;

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: {
      name,
      phone,
      bio,
      isActive,
    },
    select: safeUserSelect,
  });

  res.json({
    success: true,
    data: user,
  });
});

router.delete("/:id", async (req, res) => {
  await prisma.user.delete({
    where: { id: req.params.id },
  });

  res.json({
    success: true,
    message: "User deleted successfully",
  });
});

export  const userRoutes = router;