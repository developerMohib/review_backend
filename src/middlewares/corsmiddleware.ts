import cors, { type CorsOptions } from 'cors';
import { env } from '../config/env.config';

const allowedOrigins = new Set([
  env.CLIENT_URL,
  env.SERVER_URL
]);

const options: CorsOptions = {
  origin(origin, callback) {
    // No Origin means curl, Postman, server-to-server, etc.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.has(origin)) {
      return callback(null, origin);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  maxAge: 600,
};

export const corsMiddleware = cors(options);