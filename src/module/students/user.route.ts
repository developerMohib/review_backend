import { Router } from "express";
import {
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} from "./user.controller.js";
const router = Router();

router.get("/", getAllUsersController);

router.get("/:id", getUserByIdController);

router.patch("/:id", updateUserController);

router.delete("/:id", deleteUserController);
export const userRoutes = router;
