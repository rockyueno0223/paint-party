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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieAuthCheck = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const cookieAuthCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = yield user_model_1.default.findById(decoded.userId);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        const userObject = user.toObject();
        const { password } = userObject, rest = __rest(userObject, ["password"]);
        req.user = rest;
        next();
    }
    catch (error) {
        res.status(403).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
    }
});
exports.cookieAuthCheck = cookieAuthCheck;
