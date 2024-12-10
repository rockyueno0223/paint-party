import { Request, Response } from 'express';
import User from '../models/user.model';
import { Canvas, ICanvas } from '../models/canvas.model'
import { CanvasUser, ICanvasUser } from '../models/canvasUser.model'
import mongoose from "mongoose";
import { uploadImage } from '../utils/cloudinary.util';

// Get canvases by user id
const getCanvasHistory = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const user: ICanvasUser[] = await User.find(
            { email: email },
            { _id: 1 }
        );

        if (user.length > 0) {
            const userId = user[0]._id;
            const canvasUsers: ICanvasUser[] = await CanvasUser.find({ userId });
            const canvasIds = canvasUsers.map(cu => cu.canvasId);
            const canvasHistory: ICanvas[] = await Canvas.find({ _id: { $in: canvasIds } });

            res.status(200).json({ history: canvasHistory, success: true});
        } else {
            res.status(500).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'userId is invalid' });
    }
};

// Save a new canvas
const saveCanvas = async (req: Request, res: Response) => {
    const { canvasName, imageUrl, email } = req.body;

    try {
        // Upload image to cloudinary
        const canvasURL = await uploadImage(imageUrl, "paint-party");

        const canvas = new Canvas({ canvasName, canvasURL });
        const savedCanvas = await canvas.save();

        const canvasIdString = (savedCanvas._id as mongoose.Types.ObjectId).toString();

        const user: ICanvasUser[] = await User.find(
            { email: email },
            { _id: 1 }
        );

        if (user.length > 0) {
            const userId = user[0]._id;
            const newCanvasUser = new CanvasUser({
                canvasId: canvasIdString,
                userId: userId
            });

            await newCanvasUser.save();
            res.status(201).json({ user: userId, success: true});
        }else{
            res.status(500).json({ success: false, message: 'userId is invalid' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Image saving failed"});
    }
}

export default {
    getCanvasHistory,
    saveCanvas
};
