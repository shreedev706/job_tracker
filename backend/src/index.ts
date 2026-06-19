import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import applicationRoutes from './routes/application.routes';
import authRoutes from './routes/auth.routes';
import { globalErrorHandler } from './middlewares/error.middleware';
import cookieParser from 'cookie-parser';
const PORT = process.env.PORT || 5000;



const app = express();



const corsOptions = {
  origin: 'http://localhost:5173', // Your exact frontend URL
  credentials: true,               // Required to allow tokens/cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly include OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 204 // Keeps your 204 response stable
};

app.use(cors(corsOptions));


app.use(cookieParser());

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running smoothly!' });
});


app.use('/auth', authRoutes);
// Bind our clean MVC routing engine
app.use('/applications', applicationRoutes);


app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is flying on port ${PORT}`);
});