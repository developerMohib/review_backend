import { Router } from "express";
import {
  deleteExistUser,
  getOneUser,
  getTotalUsers,
  updateExistUser,
} from "./user.controller";

const router = Router();

router.get("/", getTotalUsers);
router.get("/:id", getOneUser);
router.patch("/:id", updateExistUser);
router.delete("/:id", deleteExistUser);

export const userRoutes = router;
