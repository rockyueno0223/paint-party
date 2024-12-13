"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieAuthCheck = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookieAuthCheck = (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecretKey);
        next();
    }
    catch (error) {
        res.status(403).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
    }
};
exports.cookieAuthCheck = cookieAuthCheck;
