import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import applicationRoutes from './routes/application.routes';
import authRoutes from './routes/auth.routes';
import { globalErrorHandler } from './middlewares/error.middleware';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 5000;

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Backend is running smoothly!' });
});

app.use('/auth', authRoutes);
app.use('/applications', applicationRoutes);

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is flying on port ${PORT}`);
});