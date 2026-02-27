import dotenv from 'dotenv';
// Load environment variables immediately
dotenv.config();

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import apiRouter from './routes/index';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRouter);

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 Handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

export default app;
