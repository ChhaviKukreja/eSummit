const express = require('express');
const bodyParser = require('body-parser');
// require('dotenv').config();
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const entRouter = require('./routes/ent');
const mentorRouter = require('./routes/mentor');

app.use("/mentor", mentorRouter);
app.use("/ent", entRouter);

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    // Join a chat room
    socket.on('join_chat', (data) => {
        const roomId = [data.userId, data.receiverId].sort().join('-');
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
    });
    
    // Handle new messages
    socket.on('send_message', (data) => {
        const roomId = [data.senderId, data.receiverId].sort().join('-');
        console.log(`Message sent in room ${roomId}:`, data.message);
        io.to(roomId).emit('receive_message', data);
    });
    
    // Handle video call signaling
    socket.on('join_meeting', (data) => {
        const meetingId = data.meetingId;
        socket.join(meetingId);
        console.log(`User ${socket.id} joined meeting: ${meetingId}`);
        
        // Notify others in the room that someone joined
        socket.to(meetingId).emit('user_joined', { userId: data.userId });
    });
    
    // Handle WebRTC signaling
    socket.on('offer', (data) => {
        socket.to(data.meetingId).emit('offer', data.offer);
    });
    
    socket.on('answer', (data) => {
        socket.to(data.meetingId).emit('answer', data.answer);
    });
    
    socket.on('ice_candidate', (data) => {
        socket.to(data.meetingId).emit('ice_candidate', data.candidate);
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
