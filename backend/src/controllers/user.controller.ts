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
    await user.save();

    //const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
    res.status(201).json({ user: user, success: true});
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
    //const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
    res.status(200).json({ user: user, success: true});
  } catch (error) {
    next(error);
  }
};

export default {
  getAllUsers,
  registerUser,
  loginUser
};