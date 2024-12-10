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
    const roomDrawings = {};
    // Socket
    io.on('connection', (socket) => {
        console.log('A new user connected');
        // Add a new room
        socket.on('addNewRoom', (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomName, rooURL, creator }) {
            // Create a new drawing data
            roomDrawings[roomName] = { creator: socket.id, drawings: [] };
            // Send new room to all users except sender
            socket.broadcast.emit('newRoom', { roomName, rooURL, creator });
            console.log(`${creator} created a new room ${roomName}`);
        }));
        // Join a room
        socket.on('join room', ({ room, username }) => {
            socket.join(room);
            console.log(`${username} joined the room ${room}`);
            // Send the current drawing state to the user
            if (roomDrawings[room]) {
                socket.emit('load canvas', roomDrawings[room].drawings);
            }
        });
        // Draw on canvas
        socket.on('drawing', ({ room, x0, y0, x1, y1, color, width }) => {
            if (roomDrawings[room] === undefined)
                return;
            const drawing = { x0, y0, x1, y1, color, width };
            // Push drawing to array
            roomDrawings[room].drawings.push(drawing);
            // Broadcast drawing to the room
            socket.to(room).emit('drawing', drawing);
        });
        // Leave a room
        socket.on('leave room', ({ room, username }) => {
            var _a;
            socket.leave(room);
            console.log(`${username} has left the room ${room}`);
            if (((_a = roomDrawings[room]) === null || _a === void 0 ? void 0 : _a.creator) === socket.id) {
                // Notify other users in the room
                io.to(room).emit('creator:left', { message: 'The creator has left the room.' });
                // Delete the room
                delete roomDrawings[room];
                console.log(`Room ${room} has been deleted as the creator left.`);
            }
        });
        // Disconnect
        socket.on('disconnect', () => {
            console.log('A user disconnected');
            // Check if the disconnected user is a creator of any room
            for (const room in roomDrawings) {
                if (roomDrawings[room].creator === socket.id) {
                    // Notify other users in the room
                    io.to(room).emit('creator:left', { message: 'The creator has disconnected.' });
                    // Delete the room
                    delete roomDrawings[room];
                    console.log(`Room ${room} has been deleted as the creator disconnected.`);
                }
            }
        });
    });
};
exports.default = setupCanvasSocket;
