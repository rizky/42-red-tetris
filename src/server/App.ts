import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import socketio from 'socket.io';
import moment from 'moment';
import dotenv from 'dotenv';

import { User, users } from './models/User';
import { Room } from './models/Room';
import { Game } from './models/Game';

dotenv.config();

const PORT = process.env.PORT_SERVER;

const app = express();
const server = http.createServer(app);

const io = socketio(server, {
  pingTimeout: 6000,
});

app.set('io', io); // anywhere in routes we should be able to get socket with `let io = app.get("io");`

const botName = 'Red Tetris';

const formatMessage = (username: string, text: string): Message => {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
};

// const game = new Game('RedTetris'); // unused

// Run when client connects
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, roomName }: { username: string, roomName: string }) => {
    const user = new User({ id: socket.id, username, roomName });

    // Initialize room instance if room exists or create if it doesn't exist
    let room = Room.getByName(roomName);
    if (!room)
      room = new Room(roomName);

    // Add user to current room
    room.addUser(user);

    // TODO: rm later
    console.log('On join room: ', users);

    socket.join(room.name);
    console.log(`Socket ${socket.id} joined ${room.name}`);

    // Welcome current user
    socket.emit('message', formatMessage(botName, `Hi ${user.username}! Welcome to Room ${room.name}!`));

    // Send current user info
    socket.emit('fetch current user', user);

    // Broadcast when a user connects
    socket.broadcast
      .to(room.name)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info when new user joins
    io.to(room.name).emit('update room users', {
      room: room.name,
      users: room.users,
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', ({ username, message, room }: { username: string, message: string, room: string }) => {
    io.to(room).emit('message', formatMessage(username, message));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = User.getById(socket.id);
    if (!user) throw Error('User not found');
    const room = Room.getByName(user.room);
    if (!room) throw Error('Room not found');

    room.removeUser(user.id);

    console.log('On leave room: ', users, room.users); // TODO: rm later

    if (room.users.length === 0) Game.removeRoom(room.name);

    io.to(room.name).emit(
      'message',
      formatMessage(botName, `${user.username} has left the game`),
    );
    // Send users and room info when user leaves
    io.to(room.name).emit('update room users', {
      room: room.name,
      users: room.users,
    });
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

