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
    origin: ['http://localhost:5173','https://task-and-reminder-calender-system.vercel.app'
    ],
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


const connectdb = require('./config/db');
connectdb();


app.use('/api/auth', require('./route/authroute'));
app.use('/api/profile', require('./route/userroute'));


const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ['http://localhost:5173','https://task-and-reminder-calender-system.vercel.app'], 
        methods: ['GET', 'POST'],
        credentials: true,
    }
});


app.options('*', cors(corsOptions)); 


io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join', (userId) => {
        socket.join(userId); 
        console.log(`User  ${userId} joined room`);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});