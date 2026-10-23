"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
router.get("/", user_controller_1.getTotalUsers);
router.get("/:id", user_controller_1.getOneUser);
router.patch("/:id", user_controller_1.updateExistUser);
router.delete("/:id", user_controller_1.deleteExistUser);
exports.userRoutes = router;
//# sourceMappingURL=user.route.js.map