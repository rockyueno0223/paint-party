import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import canvasSocket from './sockets/canvas.socket';
import canvasRouter from './routes/canvas.routes';
import authRouter from './routes/auth';
dotenv.config();

// Create server
const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
    }))
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Routes
app.use('/api/canvas', canvasRouter);
app.use('/api/auth', authRouter);

// Create HTTP server and attach Socket.IO
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Your frontend url here (Astro, React, vanilla HTML)
        methods: ["GET", "POST"]
    },
});

// Connect to MongoDB and start server
const MONGO_URI = process.env.DATABASE_URL!
mongoose
    .connect(MONGO_URI, { dbName: 'paint-paty' })
    .then(() => {
        console.log('Connected to MongoDB database');

        // Start Socket.IO
        canvasSocket(io);

        // Start the server
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });