import { Router } from "express";
import { loginController, logoutUser, registerController } from "./auth.controllers";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutUser);

export const authRoutes = router;