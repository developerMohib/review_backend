"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const user_route_js_1 = require("./routes/user.route.js");
const mentor_routes_js_1 = require("./routes/mentor.routes.js");
// parsers
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// routes here
// middle wares
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Mentor API is running",
    });
});
// api 
app.use("/api/users", user_route_js_1.userRoutes);
app.use("/api/mentors", mentor_routes_js_1.mentorRoutes);
app.get('/health', (req, res) => {
    res.send('Mentor Practice server!');
});
// global route error handler
app.all('/{*splat}', (req, res) => {
    res.status(400).json({
        success: false,
        message: 'Route not found',
    });
});
app.use((error, req, res, next) => {
    if (error) {
        res.status(400).json({
            success: false,
            message: 'Server something went wrong',
        });
    }
    next();
});
exports.default = app;
//# sourceMappingURL=index.js.map