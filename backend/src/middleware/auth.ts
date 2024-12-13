import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';

export const cookieAuthCheck = (req: Request, res: Response, next: NextFunction) => {
  const token = req.signedCookies.token;

  if (!token) {
      res.status(403).json({ success: false, message: 'Unauthorized: No token provided' });
      return;
  }

  try {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    if (!jwtSecretKey) {
      throw new Error('JWT_SECRET_KEY is not defined in environment variables.');
    }

    const decoded = jwt.verify(token, jwtSecretKey);

    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
  }
}
