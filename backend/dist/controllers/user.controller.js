"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
// Get all users
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find().sort({ createdAt: -1 }); // Sort by createdAt field
        res.status(200).json({ user: users, success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
});
// Add a new user
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        let user = yield user_model_1.default.findOne({ email });
        if (user) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return;
        }
        user = new user_model_1.default({ username, email, password });
        const savedUser = yield user.save();
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        if (!jwtSecretKey) {
            throw new Error('JWT_SECRET_KEY is not defined in environment variables.');
        }
        const token = jsonwebtoken_1.default.sign({ userId: savedUser._id }, jwtSecretKey, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            signed: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
        res.status(201).json({ user: savedUser, success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to register a user' });
    }
});
// Login user
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ success: false, message: 'Email not found' });
            return;
        }
        const isMatch = yield user.matchPassword(password);
        if (!isMatch) {
            res.status(400).json({ success: false, message: 'Invalid login credentials' });
            return;
        }
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        if (!jwtSecretKey) {
            throw new Error('JWT_SECRET_KEY is not defined in environment variables.');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, jwtSecretKey, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            signed: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
        res.status(200).json({ user: user, success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to login a user' });
    }
});
// Logout user
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('token', {
        httpOnly: true,
        signed: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    res.status(200).json({ success: true, message: 'User logged out successfully' });
});
// Check authentication
const checkAuth = (req, res) => {
    res.status(200).json({ success: true, user: req.user });
};
exports.default = {
    getAllUsers,
    registerUser,
    loginUser,
    logoutUser,
    checkAuth
};
