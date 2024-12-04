import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/user.model';
import { Canvas } from '../models/canvas.model'
import { CanvasUser } from '../models/canvasUser.model'

// Get all chats
const getCanvasHistory = async (req: Request, res: Response) => {
    try {
        const users = await User.find().sort({ createdAt: -1 }); // Sort by createdAt field
        res.status(200).json({ user: users, success: true});
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
};

const getEnrollmentsByStudentId = async (req: Request<{ userId: string }>, res: Response) => {
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
    };

const saveCanvas = async (req: Request<{ userId: string, canvasName: string, canvasURL: string }>, res: Response) => {
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
}

export default {
    getCanvasHistory,
    saveCanvas
};