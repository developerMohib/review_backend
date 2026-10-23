"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controllers_1 = require("./auth.controllers");
const router = (0, express_1.Router)();
router.post("/register", auth_controllers_1.registerController);
router.post("/login", auth_controllers_1.loginController);
router.post("/logout", auth_controllers_1.logoutUser);
exports.authRoutes = router;
//# sourceMappingURL=auth.routes.js.map