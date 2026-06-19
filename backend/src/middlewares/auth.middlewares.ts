import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_access_secret';


export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
 
  let token = req.cookies?.accessToken;

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  
  if (!token) {
    return res.status(401).json({ 
      auth: false, 
      error: 'Access denied. Please log in to view or manage data.' 
    });
  }

  try {
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    
    req.userId = decoded.userId;
    
    
    next();
  } catch (error) {
    
    return res.status(403).json({ 
      auth: false, 
      error: 'Session expired or invalid token. Please refresh your token.' 
    });
  }
};