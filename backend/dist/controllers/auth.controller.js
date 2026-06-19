"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.logout = exports.refresh = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = __importDefault(require("../prisma"));
const auth_validators_1 = require("../validators/auth.validators");
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_access_secret';
const ACCESS_TOKEN_EXPIRY = '15m'; // Short-lived security window
const REFRESH_TOKEN_EXPIRY_DAYS = 7; // Long-lived session window
// Helper to generate a random cryptographically secure string for database tracking
const generateRefreshString = () => {
    return crypto_1.default.randomBytes(40).toString('hex');
};
const register = async (req, res) => {
    try {
        console.log('=== REGISTER HIT ===');
        console.log('Body:', req.body);
        console.log('Content-Type:', req.headers['content-type']);
        const validatedData = auth_validators_1.RegisterSchema.parse(req.body);
        const existingUser = await prisma_1.default.user.findUnique({ where: { email: validatedData.email } });
        if (existingUser)
            return res.status(400).json({ error: 'A user with this email already exists' });
        const hashedPassword = await bcryptjs_1.default.hash(validatedData.password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                email: validatedData.email,
                password: hashedPassword,
                name: validatedData.name,
            },
        });
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        const refreshString = generateRefreshString();
        await prisma_1.default.refreshToken.create({
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
    }
    catch (error) {
        if (error.name === 'ZodError')
            return res.status(400).json({ errors: error.errors });
        res.status(500).json({ error: 'Registration failed' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const validatedData = auth_validators_1.LoginSchema.parse(req.body);
        const user = await prisma_1.default.user.findUnique({ where: { email: validatedData.email } });
        if (!user)
            return res.status(401).json({ error: 'Invalid email or password' });
        const isPasswordValid = await bcryptjs_1.default.compare(validatedData.password, user.password);
        if (!isPasswordValid)
            return res.status(401).json({ error: 'Invalid email or password' });
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        const refreshString = generateRefreshString();
        await prisma_1.default.refreshToken.create({
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
    }
    catch (error) {
        if (error.name === 'ZodError')
            return res.status(400).json({ errors: error.errors });
        res.status(500).json({ error: 'Login failed' });
    }
};
exports.login = login;
// 🔄 THE REFRESH ENDPOINT: Generates a fresh Access Token using a valid Refresh Token
const refresh = async (req, res) => {
    try {
        const validatedData = auth_validators_1.RefreshTokenSchema.parse(req.body);
        // Look up the refresh token in PostgreSQL
        const dbToken = await prisma_1.default.refreshToken.findUnique({
            where: { token: validatedData.refreshToken },
            include: { user: true },
        });
        // Security Checks: Does it exist? Is it revoked? Is it expired?
        if (!dbToken || dbToken.isRevoked || dbToken.expiresAt < new Date()) {
            return res.status(403).json({ error: 'Invalid, expired, or revoked refresh token' });
        }
        // Issue a brand new short-lived access token
        const newAccessToken = jsonwebtoken_1.default.sign({ userId: dbToken.userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        res.json({
            accessToken: newAccessToken,
        });
    }
    catch (error) {
        if (error.name === 'ZodError')
            return res.status(400).json({ errors: error.errors });
        res.status(500).json({ error: 'Token refresh execution failed' });
    }
};
exports.refresh = refresh;
// 🚪 THE LOGOUT ENDPOINT: Invalidates the token instantly
const logout = async (req, res) => {
    try {
        const validatedData = auth_validators_1.RefreshTokenSchema.parse(req.body);
        // Completely remove the token record from our database so it can never be used again
        await prisma_1.default.refreshToken.deleteMany({
            where: { token: validatedData.refreshToken },
        });
        res.json({ message: 'Logged out successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Logout execution failed' });
    }
};
exports.logout = logout;
const getCurrentUser = async (req, res) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: req.userId },
            select: { id: true, email: true, name: true },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch current user' });
    }
};
exports.getCurrentUser = getCurrentUser;
