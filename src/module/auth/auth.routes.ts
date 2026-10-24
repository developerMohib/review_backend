import { Router } from "express";
import {
  getCurrentUserController,
  loginController,
  logoutUser,
  registerController,
} from "./auth.controllers";
import { authenticate } from "../../middlewares/auth";

const router = Router();

router.get("/me", authenticate, getCurrentUserController);
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutUser);

export const authRoutes = router;
