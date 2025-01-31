const express=require('express');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const cors=require('cors');
const app=express();
const cookieparser=require('cookie-parser');




const http=require('http');
const socketIo=require('socket.io');
const server=http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:5173', // Allow frontend to connect
    }
});
require('dotenv').config();
app.use(express.json());
app.use(cookieparser());
const connectdb=require('./config/db');
connectdb();
app.use(cors({
    origin:['http://localhost:5173','https://task-and-reminder-calender-system.vercel.app/'],
    credentials:true,
    methods:['POST','GET','PUT','DELETE','OPTIONS'],
    allowedHeaders:['Content-Type','Authorization'],
}));
app.use('/api/auth',require('./route/authroute'));
app.use('/api/profile',require('./route/userroute')(io));
const PORT=process.env.PORT||5000;
// Listen for client connections
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join', (userId) => {
        socket.join(userId); // Join user-specific room
        console.log(`User ${userId} joined room`);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
server.listen(PORT,()=>console.log(`server running on port ${PORT}`));