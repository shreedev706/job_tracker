import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../prisma';
import { RegisterSchema, LoginSchema, RefreshTokenSchema } from '../validators/auth.validators';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_access_secret';
const ACCESS_TOKEN_EXPIRY = '15m'; // Short-lived security window
const REFRESH_TOKEN_EXPIRY_DAYS = 7; // Long-lived session window

// Helper to generate a random cryptographically secure string for database tracking
const generateRefreshString = (): string => {
  return crypto.randomBytes(40).toString('hex');
};

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = RegisterSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email: validatedData.email } });
    if (existingUser) return res.status(400).json({ error: 'A user with this email already exists' });

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
      },
    });

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshString = generateRefreshString();

    await prisma.refreshToken.create({
      data: {
        token: refreshString,
        userId: user.id,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
      },
    });

    res.status(201).json({
      accessToken,
      refreshToken: refreshString,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ errors: error.errors });
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = LoginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: validatedData.email } });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid email or password' });

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshString = generateRefreshString();

    await prisma.refreshToken.create({
      data: {
        token: refreshString,
        userId: user.id,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      accessToken,
      refreshToken: refreshString,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ errors: error.errors });
    res.status(500).json({ error: 'Login failed' });
  }
};

// 🔄 THE REFRESH ENDPOINT: Generates a fresh Access Token using a valid Refresh Token
export const refresh = async (req: Request, res: Response) => {
  try {
    const validatedData = RefreshTokenSchema.parse(req.body);

    // Look up the refresh token in PostgreSQL
    const dbToken = await prisma.refreshToken.findUnique({
      where: { token: validatedData.refreshToken },
      include: { user: true },
    });

    // Security Checks: Does it exist? Is it revoked? Is it expired?
    if (!dbToken || dbToken.isRevoked || dbToken.expiresAt < new Date()) {
      return res.status(403).json({ error: 'Invalid, expired, or revoked refresh token' });
    }

    // Issue a brand new short-lived access token
    const newAccessToken = jwt.sign({ userId: dbToken.userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });

    res.json({
      accessToken: newAccessToken,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ errors: error.errors });
    res.status(500).json({ error: 'Token refresh execution failed' });
  }
};

// 🚪 THE LOGOUT ENDPOINT: Invalidates the token instantly
export const logout = async (req: Request, res: Response) => {
  try {
    const validatedData = RefreshTokenSchema.parse(req.body);

    // Completely remove the token record from our database so it can never be used again
    await prisma.refreshToken.deleteMany({
      where: { token: validatedData.refreshToken },
    });

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout execution failed' });
  }
};