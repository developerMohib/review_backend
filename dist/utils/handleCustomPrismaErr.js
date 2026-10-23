"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePrismaError = void 0;
// Prisma error ke readable AppError e convert kore
const AppError_1 = require("./AppError");
const client_1 = require("../db/generated/prisma/client");
const handlePrismaError = (error) => {
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            throw new AppError_1.AppError("Email already exists", 409);
        }
        if (error.code === "P2025") {
            throw new AppError_1.AppError("User not found", 404);
        }
    }
    throw error;
};
exports.handlePrismaError = handlePrismaError;
//# sourceMappingURL=handleCustomPrismaErr.js.map