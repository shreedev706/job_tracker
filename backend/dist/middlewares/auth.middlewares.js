"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_access_secret';
const authenticateJWT = (req, res, next) => {
    // 1. Look for token in HttpOnly cookies first, then fall back to the Authorization header
    let token = req.cookies?.accessToken;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // 2. If no token is provided anywhere, block the request immediately
    if (!token) {
        return res.status(401).json({
            auth: false,
            error: 'Access denied. Please log in to view or manage data.'
        });
    }
    try {
        // 3. Cryptographically verify the token using your JWT_SECRET key
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // 4. Attach the user's ID to the request object so subsequent controllers can use it
        req.userId = decoded.userId;
        // 5. Let the request proceed to your controllers smoothly
        next();
    }
    catch (error) {
        // If the token is fake, altered, or expired (past its 15-minute lifespan)
        return res.status(403).json({
            auth: false,
            error: 'Session expired or invalid token. Please refresh your token.'
        });
    }
};
exports.authenticateJWT = authenticateJWT;
