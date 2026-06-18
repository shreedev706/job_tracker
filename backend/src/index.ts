import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import applicationRoutes from './routes/application.routes';
import authRoutes from './routes/auth.routes';
import { globalErrorHandler } from './middlewares/error.middleware';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: 'http://localhost:3000', // Update this to match your frontend URL if different
  credentials: true // Crucial to allow HttpOnly cookies to pass through CORS
}));

app.use(cookieParser());
app.use(cors());
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