import express from 'express';
const app = express();
import cors from 'cors';
import { userRoutes } from './routes/user.route.js';
import { mentorRoutes } from './routes/mentor.routes.js';
// parsers
app.use(express.json());
app.use(cors());
// routes here
// middle wares
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Mentor API is running",
    });
});
// api 
app.use("/api/users", userRoutes);
app.use("/api/mentors", mentorRoutes);
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
export default app;
//# sourceMappingURL=index.js.map