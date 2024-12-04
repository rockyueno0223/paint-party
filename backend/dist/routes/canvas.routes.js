"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const canvas_controller_1 = __importDefault(require("../controllers/canvas.controller"));
const canvasRouter = express_1.default.Router();
canvasRouter.get('/', canvas_controller_1.default.getCanvasHistory);
canvasRouter.post('/'); //create new canvas
canvasRouter.post('/save', canvas_controller_1.default.saveCanvas); //save the canvas
exports.default = canvasRouter;
