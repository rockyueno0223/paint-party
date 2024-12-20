import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

// Get all users
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }); // Sort by createdAt field
    res.status(200).json({ user: users, success: true});
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
};

// Add a new user
const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ success: false, message: 'User already exists' });
      return;
    }

    user = new User({ username, email, password });
    const savedUser = await user.save();

    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    if (!jwtSecretKey) {
      throw new Error('JWT_SECRET_KEY is not defined in environment variables.');
    }

    const token = jwt.sign({ userId: savedUser._id }, jwtSecretKey, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      signed: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.status(201).json({ user: savedUser, success: true});
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to register a user' });
  }
};

// Login user
const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ success: false, message: 'Email not found' });
      return;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Invalid login credentials' });
      return;
    }

    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    if (!jwtSecretKey) {
      throw new Error('JWT_SECRET_KEY is not defined in environment variables.');
    }

    const token = jwt.sign({ userId: user._id }, jwtSecretKey, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      signed: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.status(200).json({ user: user, success: true});
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to login a user' });
  }
};

// Logout user
const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  res.status(200).json({ success: true, message: 'User logged out successfully' });
};

// Check authentication
const checkAuth = (req: Request, res: Response) => {
  res.status(200).json({ success: true, user: req.user });
};

export default {
  getAllUsers,
  registerUser,
  loginUser,
  logoutUser,
  checkAuth
};
