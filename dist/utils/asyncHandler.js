"use strict";
// src/utils/asyncHandler.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
const asyncHandler = (controller) => {
    return (req, res, next) => {
        Promise.resolve()
            .then(() => controller(req, res, next))
            .catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=asyncHandler.js.map