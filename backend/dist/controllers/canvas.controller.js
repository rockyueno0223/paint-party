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
// Get all chats
const getCanvasHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find().sort({ createdAt: -1 }); // Sort by createdAt field
        res.status(200).json({ user: users, success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
});
const getEnrollmentsByStudentId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   const canvasUsers = await CanvasUser.find({ studentId: req.params.userId }).populate('courseId')
    //   res.status(200).json(canvasUsers)
    // } catch (err) {
    //   console.error(err)
    //   res.status(500).json({ error: 'Unable to get student\'s enrolments' })
    // }
    // try {
    //     const canvasUsers = await CanvasUser.find({ studentId: req.params.userId }).populate('canvasId');
    //     const canvasDetails = canvasUsers.map((canvasUser) => {
    //       return {
    //         // canvasId: canvasUser.canvasId,
    //         // canvasName: canvasUser.canvasId.canvasName,
    //         // URL: canvasUser.canvasId.URL
    //       };
    //     });
    //     console.log(canvasUsers)
    //     //return canvasDetails;
    //     return canvasUsers;
    //   } catch (error) {
    //     console.error('Error fetching canvas details:', error);
    //     throw error;
    //   }
});
const saveCanvas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const saveUser = req.params.userId;
    // const saveCanvasName = req.params.canvasName;
    // const saveCanvasURL = req.params.canvasURL;
    // try {
    //     const canvas = new Canvas({ saveCanvasName, saveCanvasURL });
    //     const savedCanvas = await canvas.save();
    //     console.log('New user ID:', savedCanvas._id);
    //     const saveCanvasId = savedCanvas._id;
    //     const canvasUser = new CanvasUser({ saveCanvasId, saveUser });
    //     await canvasUser.save();
    //     res.status(201).json();
    // } catch (error) {
    //     console.error('Error fetching canvas details:', error);
    //     throw error;
    // }
});
exports.default = {
    getCanvasHistory,
    saveCanvas
};
