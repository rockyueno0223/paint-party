import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/user.model';
import { Canvas, ICanvas } from '../models/canvas.model'
import { CanvasUser, ICanvasUser } from '../models/canvasUser.model'
import mongoose from "mongoose";
import { deleteImage, uploadImage } from '../utils/cloudinary.util';
import path from 'path';

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

// Get all chats
const getCanvasHistory = async (req: Request, res: Response) => {
    const { userId } = req.body;
    try {
        //const canvasUsers = await CanvasUser.find({ userId: userId }).populate('canvasId')
        const canvasUsers: ICanvasUser[] = await CanvasUser.find({ userId });
        const canvasIds = canvasUsers.map(cu => cu.canvasId);
        const canvases: ICanvas[] = await Canvas.find({ _id: { $in: canvasIds } });

        const canvasHistory = canvases.map(canvas => ({
            canvasName: canvas.canvasName,
            canvasURL: canvas.canvasURL
        }));
        console.log(canvasHistory)

        //res.status(200).json(canvasUsers)
        res.status(200).json({ history: canvasHistory, success: true});
    } catch (error) {
        res.status(500).json({ success: false, message: 'userId is invalid' });
    }
};

// Add property
const addProperty = async (canvasName : string) => {
    try {
        const filePath = path.join(__dirname, `../../uploads/${canvasName}.png`);

        const response = await uploadImage(filePath, "paint-party");
        return response
    }catch (error){
        return error
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
}
const saveCanvas = async (req: Request<{ userId: string, canvasName: string }>, res: Response) => {
    const { userId, canvasName } = req.body;

    try {
        const filePath = path.join(__dirname, `../../uploads/${canvasName}.png`);
        const canvasURL = await uploadImage(filePath, "paint-party");

        const canvas = new Canvas({ canvasName, canvasURL });
        const savedCanvas = await canvas.save();

        const canvasIdString = (savedCanvas._id as mongoose.Types.ObjectId).toString();
        //console.log('New user ID:', canvasIdString);

        const newCanvasUser = new CanvasUser({
            canvasId: canvas._id,
            userId: userId
        });

        await newCanvasUser.save();
        
        //const canvasUser = new CanvasUser({ canvasIdString, userId });
        //await canvasUser.save();

        res.status(201).json({ user: userId, success: true});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error});
    }
}

export default {
    getCanvasHistory,
    addProperty,
    saveCanvas
};