import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

export const cookieAuthCheck = async (req: Request, res: Response, next: NextFunction) => {
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

    const decoded = jwt.verify(token, jwtSecretKey) as { userId: string };

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    const { password, ...rest } = user;
    req.user = rest;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
  }
}
