const express = require('express');
const app = express();
const cors = require('cors');
const WebSocket = require('ws');
const server = require('http').createServer(app);
require('dotenv').config();

const PORT = process.env.PORT;

app.use(cors());

const wss = new WebSocket.Server({ server });

const rooms = new Map();

wss.on('connection', (ws) => {
  console.log('A user connected.');

  ws.on('message', (data, isBinary) => {
    console.log('MESSAGE: ', JSON.parse(data));
    const { room, user, method } = JSON.parse(data);
    switch (method) {
      case 'join':
        if (!rooms.has(room)) {
          rooms.set(room, {
            inProgress: false,
            users: [
              {
                id: user.id,
                name: user.username,
                isHost: true,
                ws: ws,
              },
            ],
          });
        } else {
          const currentRoom = rooms.get(room);
          currentRoom.users.push({
            id: user.id,
            name: user.username,
            isHost: false,
            ws: ws,
          });
          rooms.set(room, currentRoom);
        }
        console.log('ROOMS: ', rooms);
        const currentUsers = rooms.get(room);
        for (let i = 0; i < currentUsers.users.length; i++) {
          console.log('SENDING TO: ', currentUsers.users[i].name);
          currentUsers.users[i].ws.send(
            JSON.stringify({
              type: 'connection',
              message: `${user.username} has joined the session.`,
            }),
            { binary: isBinary }
          );
        }
        break;

      case 'leave':
        const currentRoom = rooms.get(room);
        currentRoom.users = currentRoom.users.filter((user) => user.ws !== ws);
        console.log('USERS: ', currentRoom.users.length);
        if (currentRoom.users.length === 0) {
          rooms.delete(room);
          console.log('The last remaining user left the session.');
          console.log('ROOMS: ', rooms);
          break;
        }
        rooms.set(room, currentRoom);
        console.log('A user left the session.');
        break;
    }
  });
});

server.listen(PORT, () =>
  console.log(`WebSocket server running on PORT: ${PORT}`)
);
