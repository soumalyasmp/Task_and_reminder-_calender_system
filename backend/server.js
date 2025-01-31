const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:5173', // Local development
        'https://task-and-reminder-calender-system.vercel.app' // Production frontend
    ],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Database connection
const connectdb = require('./config/db');
connectdb();

// Routes
app.use('/api/auth', require('./route/authroute'));
app.use('/api/profile', require('./route/userroute'));

// Create HTTP server and Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ['http://localhost:5173', 'https://task-and-reminder-calender-system.vercel.app'], // Allow frontend to connect
        methods: ['GET', 'POST'],
        credentials: true,
    }
});

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join', (userId) => {
        socket.join(userId); // Join user-specific room
        console.log(`User  ${userId} joined room`);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});