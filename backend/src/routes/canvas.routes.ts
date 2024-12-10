import express from 'express';
import canvasController from '../controllers/canvas.controller';
import upload from '../config/multer';

const canvasRouter = express.Router();

canvasRouter.post('/history', canvasController.getCanvasHistory);
canvasRouter.post('/save', upload.single("image"), canvasController.saveCanvas);

export default canvasRouter;
