"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorRoutes = void 0;
const express_1 = require("express");
const mentor_controller_js_1 = require("./mentor.controller.js");
const router = (0, express_1.Router)();
router.get("/", mentor_controller_js_1.getAllMentorsController);
router.get("/:id", mentor_controller_js_1.getMentorByIdController);
router.post("/", mentor_controller_js_1.createMentorController); /// will be role update so, it from user
router.patch("/:id", mentor_controller_js_1.updateMentorController);
router.delete("/:id", mentor_controller_js_1.deleteMentorController);
exports.mentorRoutes = router;
//# sourceMappingURL=mentor.routes.js.map