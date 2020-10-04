import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import socketio from 'socket.io';
import moment from 'moment';

import { userJoin, getRoomUsers, getCurrentUser, userLeave } from './controllers/users';

const PORT = process.env.PORT_SERVER;

const app = express();
const server = http.createServer(app);

const io = socketio(server, {
  pingTimeout: 6000,
});

app.set('io', io); // anywhere in routes we should be able to get socket with `let io = app.get("io");`

const botName = 'Red Tetris';

function formatMessage(username: string, text: string) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}

// Run when client connects
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin({ id: socket.id, username, room});
    socket.join(user.room);
    console.log(`Socket ${socket.id} joined ${room}`);

    // Welcome current user
    socket.emit('message', formatMessage(botName, `Hi ${username}! Welcome to Room ${room}!`));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info when new user joins
    io.to(user.room).emit('update room users', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', (message) => {
    const user = getCurrentUser(socket.id);
    if (!user) throw Error('User not found');
    io.to(user.room).emit('message', formatMessage(user.username, message));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info when user exits
      io.to(user.room).emit('update room users', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

