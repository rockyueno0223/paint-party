import express from 'express';
import canvasController from '../controllers/canvas.controller';

const canvasRouter = express.Router();

canvasRouter.get('/', canvasController.getCanvasHistory);
canvasRouter.post('/') //create new canvas
canvasRouter.post('/save', canvasController.saveCanvas) //save the canvas

export default canvasRouter;