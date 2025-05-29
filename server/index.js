import express from 'express';
import http from 'node:http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import gameRoutes from './routes/game.js';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fruits-game';
const JWT_SECRET = process.env.JWT_SECRET || 'Banana@123';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/game', gameRoutes);


io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error: Token missing'));
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
});

io.on('connection', async (socket) => {
  console.log(`User connected: ${socket.userId}`);
  
  try {

    await User.findByIdAndUpdate(socket.userId, { isOnline: true });
    
    io.emit('user_status', { userId: socket.userId, isOnline: true });
    
    socket.on('get_click_count', async ({ userId }) => {
      try {
        const user = await User.findById(userId);
        if (user) {
          socket.emit('click_count', { userId: user._id, clickCount: user.clickCount });
        }
      } catch (err) {
        console.error('Error fetching click count:', err);
      }
    });
    
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.userId}`);
      
      try {

        await User.findByIdAndUpdate(socket.userId, { isOnline: false });
        
        io.emit('user_status', { userId: socket.userId, isOnline: false });
      } catch (err) {
        console.error('Error updating user status on disconnect:', err);
      }
    });
  } catch (err) {
    console.error('Error handling socket connection:', err);
  }
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

export { io };