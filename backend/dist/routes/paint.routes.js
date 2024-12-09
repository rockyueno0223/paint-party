"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import paintController from '../controllers/paint.controller';
const chatRouter = express_1.default.Router();
// Get all chat messages
// chatRouter.get('/login', paintController.getAllChats);
// chatRouter.get('/canvas', paintController.getMessagesByRoom);
exports.default = chatRouter;
