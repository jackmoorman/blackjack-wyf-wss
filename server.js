const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});
require('dotenv').config();

const PORT = process.env.PORT || 3500;

io.on('connection', (socket) => {
  console.log('a user connected');
})

server.listen(PORT, () => console.log(`Socket.io server running on PORT: ${PORT}`));

// server.listen(PORT, () => console.log(`Server running on port ${PORT}`))