import express from 'express';
import canvasController from '../controllers/canvas.controller';
import upload from '../config/multer';

const canvasRouter = express.Router();

canvasRouter.post('/save', upload.single("image"), canvasController.saveCanvas);
canvasRouter.get('/:userId', canvasController.getCanvasByUserId);

export default canvasRouter;
