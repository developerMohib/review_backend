import { Router } from "express";
import { createNewUser, deleteExistUser, getOneUser, getTotalUsers, updateExistUser } from "./user.controller";

const router = Router();

router.get("/", getTotalUsers);
router.get("/:id", getOneUser);
router.post("/", createNewUser);
router.patch("/:id", updateExistUser);
router.delete("/:id", deleteExistUser);

export const userRoutes = router;