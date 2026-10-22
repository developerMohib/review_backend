import express  from 'express';
import type { Application, Request, Response, NextFunction } from 'express';
const app: Application = express();
import cors from 'cors';
import { userRoutes } from './routes/user.route.js';
import { mentorRoutes } from './routes/mentor.routes.js';

const allowedOrigins = new Set(
  (process.env.CLIENT_URL ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
);

// parsers
app.use(express.json());
app.use(cors({
  origin(origin, callback) {
    if (process.env.NODE_ENV !== 'production' || !origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
}));

// routes here

// middle wares

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Mentor API is running",
  });
});


// api 
app.use("/api/users", userRoutes);
app.use("/api/mentors", mentorRoutes);



app.get('/health', (req: Request, res: Response) => {
  res.send('Mentor Practice server!');
});

// global route error handler
app.all('/{*splat}', (req: Request, res: Response) => {
  res.status(400).json({
    success: false,
    message: 'Route not found',
  });
});

// global error handler
type Err = string | number | undefined | null;
app.use((error: Err, req: Request, res: Response, next: NextFunction) => {
  if (error) {
    res.status(400).json({
      success: false,
      message: 'Server something went wrong',
    });
  }
  next();
});

export default app;