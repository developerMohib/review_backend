"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_js_1 = require("./user.controller.js");
const router = (0, express_1.Router)();
router.get("/", user_controller_js_1.getAllUsersController);
router.get("/:id", user_controller_js_1.getUserByIdController);
router.patch("/:id", user_controller_js_1.updateUserController);
router.delete("/:id", user_controller_js_1.deleteUserController);
exports.userRoutes = router;
//# sourceMappingURL=user.route.js.map