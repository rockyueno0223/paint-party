import express from 'express';
import canvasController from '../controllers/canvas.controller';
import upload from '../config/multer';

const canvasRouter = express.Router();

canvasRouter.post('/') //create new canvas
canvasRouter.post('/save', upload.single("image"), canvasController.saveCanvas) //save the canvas
//canvasRouter.post('/save', upload.single("image"), canvasController.addProperty) //save the canvas
canvasRouter.post('/history', canvasController.getCanvasHistory);

export default canvasRouter;