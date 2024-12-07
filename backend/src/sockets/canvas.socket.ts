import { Server, Socket } from 'socket.io';

const setupCanvasSocket = (io: Server) => {
    const roomDrawings: any = {};

    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('drawing', (data) => {
            const { room, x0, y0, x1, y1, color, width } = data;
            if (!roomDrawings[room]) {
            roomDrawings[room] = [];
        }
        roomDrawings[room].push({ x0, y0, x1, y1, color, width });
        // Broadcast to the specific room
        socket.to(room).emit('drawing', data);
            const draingInfo = data
            try {
                // For room-based broadcast
                io.to(data.room).emit('newDrawing', draingInfo)
            } catch (error) {
                console.error('Error saving chat:', error);
            }
        });
        socket.on('addNewRoom', async (data) => {
            const roomInfo = data
            socket.broadcast.emit('newRoom', roomInfo);
            //io.emit('newRoom', roomInfo);
        })
        socket.on('sendDrawing', async (data) => {
            console.log(data)
            const { username, message, room } = data;
            const draingInfo = data
            try {
              // For room-based broadcast
                io.to(data.room).emit('newDrawing', draingInfo)
            } catch (error) {
                console.error('Error saving chat:', error);
            }
        });
        socket.on('join room', (data) => {
            const { room } = data;
            socket.join(room)

            // Send the current drawing state to the user
        if (roomDrawings[room]) {
            socket.emit('load canvas', roomDrawings[room]);
        }
        })
          // Leaving a room
        socket.on('leave room', (data) => {
            socket.leave(data.room)
            console.log(`${data.username} has left the room ${data.room}`)
            io.to(data.room).emit('newMessage', {
                message: `${data.username} has left the room ${data.room}`,
                username: 'System',
                room: data.room
            })
        })
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}
export default setupCanvasSocket;