import mongoose, { Schema, Document } from "mongoose";

export interface ICanvasUser extends Document {
    _id: mongoose.Types.ObjectId
    canvasId: mongoose.Schema.Types.ObjectId
    userId: mongoose.Schema.Types.ObjectId
}

const CanvasUserSchema: Schema = new Schema(
    {
    canvasId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Canvas' },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
    },
    { timestamps: true }
)

export const CanvasUser = mongoose.model<ICanvasUser>('CanvasUser', CanvasUserSchema)
