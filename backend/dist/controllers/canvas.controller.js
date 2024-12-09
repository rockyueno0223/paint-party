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
const path_1 = __importDefault(require("path"));
// Get all chats
const getCanvasHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        //const canvasUsers = await CanvasUser.find({ userId: userId }).populate('canvasId')
        // const user: ICanvasUser[] = await User.find(
        //     { email: email },
        //     { _id: 1 }    
        // );
        // const UserId = user[0]._id
        // console.log(UserId)
        // const canvasUsers: ICanvasUser[] = await CanvasUser.find({ UserId });
        const user = yield user_model_1.default.find({ email: email }, { _id: 1 });
        if (user.length > 0) {
            const userId = user[0]._id;
            const canvasUsers = yield canvasUser_model_1.CanvasUser.find({ userId });
            const canvasIds = canvasUsers.map(cu => cu.canvasId);
            const canvases = yield canvas_model_1.Canvas.find({ _id: { $in: canvasIds } });
            const canvasHistory = canvases;
            //     const canvasHistory = canvases.map(canvas => ({
            //         canvasName: canvas.canvasName,
            //         canvasURL: canvas.canvasURL
            //     }));
            // console.log(canvasHistory)
            res.status(200).json({ history: canvasHistory, success: true });
        }
        else {
            res.status(500).json({ success: false, message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'userId is invalid' });
    }
});
// Add property
const addProperty = (canvasName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = path_1.default.join(__dirname, `../../uploads/${canvasName}.png`);
        const response = yield (0, cloudinary_util_1.uploadImage)(filePath, "paint-party");
        return response;
    }
    catch (error) {
        return error;
    }
    // upload image to cloudinary
    // if (req.file) {
    //     try {
    //         imageUrl = await uploadImage(req.file.path, "property-management");
    //     } catch (error) {
    //         res.status(500).json({ success: false, message: (error as Error).message });
    //         return;
    //     }
    // }
});
const saveCanvas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { canvasName, imageUrl, email } = req.body;
    try {
        //const filePath = path.join(__dirname, `../../uploads/${canvasName}.png`);
        const filePath = imageUrl;
        //console.log(filePath)
        const canvasURL = yield (0, cloudinary_util_1.uploadImage)(filePath, "paint-party");
        const canvas = new canvas_model_1.Canvas({ canvasName, canvasURL });
        const savedCanvas = yield canvas.save();
        const canvasIdString = savedCanvas._id.toString();
        const user = yield user_model_1.default.find({ email: email }, { _id: 1 });
        if (user.length > 0) {
            const userId = user[0]._id;
            //console.log(userId)
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
        //const canvasUser = new CanvasUser({ canvasIdString, userId });
        //await canvasUser.save();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Image saving failed" });
    }
});
exports.default = {
    getCanvasHistory,
    addProperty,
    saveCanvas
};
