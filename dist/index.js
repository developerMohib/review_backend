"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = require("express-rate-limit");
const user_route_js_1 = require("./routes/user.route.js");
const mentor_routes_js_1 = require("./routes/mentor.routes.js");
const app = (0, express_1.default)();
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = new Set((process.env.CLIENT_URL ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean));
// ---------- Security & logging ----------
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)(isProduction ? 'combined' : 'dev'));
app.use((0, compression_1.default)());
app.use((0, cors_1.default)({
    origin(origin, callback) {
        if (!isProduction || !origin || allowedOrigins.has(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
}));
// ---------- Rate limit (shudhu /api te) ----------
const apiLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minute
    limit: 300, // per IP
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
});
// ---------- Parsers ----------
app.use(express_1.default.json({ limit: '1mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// ---------- Health routes ----------
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Mentor API is running' });
});
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});
// ---------- API routes ----------
app.use('/api', apiLimiter);
app.use('/api/users', user_route_js_1.userRoutes);
app.use('/api/mentors', mentor_routes_js_1.mentorRoutes);
// ---------- 404 handler ----------
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});
// ---------- Global error handler ----------
app.use((error, req, res, _next) => {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Something went wrong';
    const status = typeof error === 'object' && error !== null && 'status' in error && typeof error.status === 'number'
        ? error.status
        : 500;
    res.status(status).json({
        success: false,
        message: isProduction && status === 500 ? 'Internal server error' : message,
    });
});
exports.default = app;
//# sourceMappingURL=index.js.map