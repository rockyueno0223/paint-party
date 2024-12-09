import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';

// Get all chats
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }); // Sort by createdAt field
    res.status(200).json({ user: users, success: true});
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
};

const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ success: false, message: 'User already existss' });
      return;
    }

    user = new User({ username, email, password });
    const savedUser = await user.save();

    res.cookie('isAuthenticated', true, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      signed: true,

    });
    res.cookie('email', savedUser.email.toString(), {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      signed: true,
    });

    //const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
    res.status(201).json({ user: savedUser, success: true});
  } catch (error) {
    //next(error);
    res.status(500).json({ success: false, message: 'An unexpected error occurred' });
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid login credentials' });
      return;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Invalid login credentials' });
      return;
    }
    
    res.cookie('isAuthenticated', true, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      signed: true,

    });
    res.cookie('email', user.email.toString(), {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      signed: true,

    });
    //const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
    res.status(200).json({ user: user, success: true});
  } catch (error) {
    next(error);
  }
};

// Logout user
const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie('isAuthenticated', {
    httpOnly: true,
    signed: true
  });
  res.clearCookie('email', {
    httpOnly: true,
    signed: true
  });
  res.status(200).json({ success: true, message: 'User logged out successfully' });
};

// Check authentication
const checkAuth = (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Auth checked successful' });
};

export default {
  getAllUsers,
  registerUser,
  loginUser,
  logoutUser,
  checkAuth
};