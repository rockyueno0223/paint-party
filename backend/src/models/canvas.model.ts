import mongoose, { Schema, Document } from "mongoose";

export interface ICanvas extends Document {
    canvasURL: string
    canvasName: string
}

const CanvasSchema: Schema = new Schema(
    {
    canvasURL: { type: String, required: true },
    canvasName: { type: String, required: true }
    },
    { timestamps: true }
)

export const Canvas = mongoose.model<ICanvas>('Canvas', CanvasSchema)