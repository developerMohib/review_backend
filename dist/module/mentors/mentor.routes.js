"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorRoutes = void 0;
const express_1 = require("express");
const mentor_controller_1 = require("./mentor.controller");
const router = (0, express_1.Router)();
router.get("/", mentor_controller_1.getMentors);
router.get("/:id", mentor_controller_1.getMentor);
router.post("/", mentor_controller_1.createMentor);
router.patch("/:id", mentor_controller_1.updateMentor);
router.delete("/:id", mentor_controller_1.deleteMentor);
exports.mentorRoutes = router;
//# sourceMappingURL=mentor.routes.js.map