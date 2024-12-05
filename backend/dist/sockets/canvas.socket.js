"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const setupCanvasSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('drawing', (data) => {
            socket.broadcast.emit('drawing', data);
            const draingInfo = data;
            try {
                // For room-based broadcast
                io.to(data.room).emit('newDrawing', draingInfo);
            }
            catch (error) {
                console.error('Error saving chat:', error);
            }
        });
        socket.on('addNewRoom', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const roomInfo = data;
            socket.broadcast.emit('newRoom', roomInfo);
            //io.emit('newRoom', roomInfo);
        }));
        socket.on('sendDrawing', (data) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(data);
            const { username, message, room } = data;
            const draingInfo = data;
            try {
                // Save message to MongoDB
                //   const chat = new Chat({ username, message, room });
                //   await chat.save();
                // Broadcast the chat object to all connected clients via the newMessage event
                //io.emit('newMessage', chat);
                // For room-based broadcast
                io.to(data.room).emit('newDrawing', draingInfo);
            }
            catch (error) {
                console.error('Error saving chat:', error);
            }
        }));
        socket.on('join room', (data) => {
            socket.join(data.room);
            console.log(`${data.username} joined the room ${data.room}`);
            io.to(data.room).emit('newMessage', {
                message: `${data.username} joined the room ${data.room}`,
                username: 'System',
                room: data.room
            });
        });
        // Leaving a room
        socket.on('leave room', (data) => {
            socket.leave(data.room);
            console.log(`${data.username} has left the room ${data.room}`);
            io.to(data.room).emit('newMessage', {
                message: `${data.username} has left the room ${data.room}`,
                username: 'System',
                room: data.room
            });
        });
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
};
exports.default = setupCanvasSocket;
