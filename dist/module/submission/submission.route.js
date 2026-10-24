"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submissionRoutes = void 0;
const express_1 = require("express");
const submission_controller_1 = require("./submission.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.post("/", auth_1.authenticate, submission_controller_1.createSubmissionController);
router.get("/my", auth_1.authenticate, submission_controller_1.getMySubmissionsController);
router.get("/all", auth_1.authenticate, submission_controller_1.getAllSubmissionsController);
// router.get("/:id", getUserByIdController);
// router.patch("/:id", updateUserController);
exports.submissionRoutes = router;
//# sourceMappingURL=submission.route.js.map