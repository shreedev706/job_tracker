import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_access_secret';

// Extend the Express Request interface to prevent TypeScript compiler errors
export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // 4. Attach the user's ID to the request object so subsequent controllers can use it
    req.userId = decoded.userId;
    
    // 5. Let the request proceed to your controllers smoothly
    next();
  } catch (error) {
    // If the token is fake, altered, or expired (past its 15-minute lifespan)
    return res.status(403).json({ 
      auth: false, 
      error: 'Session expired or invalid token. Please refresh your token.' 
    });
  }
};