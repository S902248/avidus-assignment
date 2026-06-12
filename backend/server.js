const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Avidus Task Manager API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const http = require('http');
const socket = require('./utils/socket');

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    
    // Create HTTP server and initialize socket.io
    const server = http.createServer(app);
    const io = socket.init(server);
    
    io.on('connection', (socketClient) => {
      console.log(`[Socket] Client connected: ${socketClient.id}`);
      
      // Clients identifying as admin join the admin room
      socketClient.on('join_admin', () => {
        socketClient.join('admin_room');
        console.log(`[Socket] Client ${socketClient.id} joined admin_room`);
      });

      socketClient.on('disconnect', () => {
        console.log(`[Socket] Client disconnected: ${socketClient.id}`);
      });
    });

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
