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
const user_model_1 = __importDefault(require("../models/user.model"));
const canvas_model_1 = require("../models/canvas.model");
const canvasUser_model_1 = require("../models/canvasUser.model");
const cloudinary_util_1 = require("../utils/cloudinary.util");
// Get canvas by user id
const getCanvasByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const canvasUsers = yield canvasUser_model_1.CanvasUser.find({ userId });
        if (canvasUsers.length === 0) {
            res.status(200).json({ history: [], success: true });
            return;
        }
        const canvasIds = canvasUsers.map(cu => cu.canvasId);
        const canvasHistory = yield canvas_model_1.Canvas.find({ _id: { $in: canvasIds } });
        res.status(200).json({ history: canvasHistory, success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'userId is invalid' });
    }
});
// Save a new canvas
const saveCanvas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { canvasName, imageUrl, email } = req.body;
    try {
        // Upload image to cloudinary
        const canvasURL = yield (0, cloudinary_util_1.uploadImage)(imageUrl, "paint-party");
        const canvas = new canvas_model_1.Canvas({ canvasName, canvasURL });
        const savedCanvas = yield canvas.save();
        const canvasIdString = savedCanvas._id.toString();
        const user = yield user_model_1.default.find({ email: email }, { _id: 1 });
        if (user.length > 0) {
            const userId = user[0]._id;
            const newCanvasUser = new canvasUser_model_1.CanvasUser({
                canvasId: canvasIdString,
                userId: userId
            });
            yield newCanvasUser.save();
            res.status(201).json({ user: userId, success: true });
        }
        else {
            res.status(500).json({ success: false, message: 'userId is invalid' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Image saving failed" });
    }
});
exports.default = {
    getCanvasByUserId,
    saveCanvas
};
