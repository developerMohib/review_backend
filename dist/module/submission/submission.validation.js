"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubmissionSchema = void 0;
const zod_1 = require("zod");
const normalizeUrl = (v) => v.trim().toLowerCase().replace(/\.git$/, "").replace(/\/+$/, "");
exports.createSubmissionSchema = zod_1.z.object({
    projectName: zod_1.z.string().trim().min(3).max(100),
    repoUrl: zod_1.z.string().trim().url().transform(normalizeUrl),
    liveUrl: zod_1.z.string().trim().url().optional().or(zod_1.z.literal("")),
    description: zod_1.z.string().trim().min(20).max(1000),
    category: zod_1.z.string().trim()
});
//# sourceMappingURL=submission.validation.js.map