"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const canvas_controller_1 = __importDefault(require("../controllers/canvas.controller"));
const multer_1 = __importDefault(require("../config/multer"));
const canvasRouter = express_1.default.Router();
canvasRouter.post('/'); //create new canvas
canvasRouter.post('/save', multer_1.default.single("image"), canvas_controller_1.default.saveCanvas); //save the canvas
//canvasRouter.post('/save', upload.single("image"), canvasController.addProperty) //save the canvas
canvasRouter.post('/history', canvas_controller_1.default.getCanvasHistory);
exports.default = canvasRouter;
