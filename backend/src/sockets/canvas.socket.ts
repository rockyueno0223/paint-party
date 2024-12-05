import { Server, Socket } from 'socket.io';

const setupCanvasSocket = (io: Server) => {
    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('drawing', (data) => {
            socket.broadcast.emit('drawing', data);
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
              // Save message to MongoDB
            //   const chat = new Chat({ username, message, room });
            //   await chat.save();

              // Broadcast the chat object to all connected clients via the newMessage event
              //io.emit('newMessage', chat);

              // For room-based broadcast
                io.to(data.room).emit('newDrawing', draingInfo)
            } catch (error) {
                console.error('Error saving chat:', error);
            }
        });
        
        socket.on('join room', (data) => {
            socket.join(data.room)
            console.log(`${data.username} joined the room ${data.room}`)
            io.to(data.room).emit('newMessage', {
                message: `${data.username} joined the room ${data.room}`,
                username: 'System',
                room: data.room 
            })
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