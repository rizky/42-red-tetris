import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import socketio from 'socket.io';
import moment from 'moment';
import dotenv from 'dotenv';

import { Player, players } from './models/Player';
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
    time: moment().format('h:mm a'),
  };
};

io.on('connection', (socket) => {
  socket.on('create user', (username: string) => {
    new Player({ id: socket.id, username });
  });
  socket.on('join room', ({ username, roomName }: { username: string, roomName: string }) => {
    const player = Player.getByUsername(username);

    // Fetch room if it exists or create if it doesn't exist
    let room = Room.getByName(roomName);
    if (!room) {
      room = new Room(roomName);
      const roomNames = Game.getWaitingRoomNames();
      socket.broadcast.emit('update waiting rooms', roomNames);
    }

    // Add player to current room
    if (player) {
      room.addPlayer(player);

      console.log('On join room: ', players);

      socket.join(room.name);
      console.log(`Socket ${socket.id} joined ${room.name}`);

      // Welcome current player
      socket.emit('message', formatMessage(botName, `Hi ${player.username}! Welcome to Room ${room.name}!`));

      // Send current player info
      socket.emit('fetch current player', player);

      // Broadcast when a player connects
      socket.broadcast
        .to(room.name)
        .emit(
          'message',
          formatMessage(botName, `${player.username} has joined the chat`),
        );

      // Send players and room info when new player joins
      io.to(room.name).emit('update room players', {
        room: room.name,
        players: room.players,
      });
    }
  });

  // Listen for chatMessage
  socket.on('chatMessage', ({ username, message, room }: { username: string, message: string, room: string }) => {
    io.to(room).emit('message', formatMessage(username, message));
  });

  // Fetch all waiting rooms to Login screen
  socket.on('fetch waiting rooms', () => {
    const roomNames = Game.getWaitingRoomNames();
    socket.emit('all waiting rooms', roomNames);
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const player = Player.getById(socket.id);
    if (player) {
      const room = Room.getByName(player.room);
      if (!room) {
        player.deletePlayer(player.id);
      } else {
        room.removePlayer(player.id);
        console.log('On leave room: ', players, room.players);

        if (room.players.length === 0) {
          // TODO: only makes sence if game has not been started and room was deleted.
          // If started game was finished we don't care about waiting rooms - 
          // room with started game should be deleted from waiting room before, somewhere else
          Game.removeRoom(room.name);
          const roomNames = Game.getWaitingRoomNames();
          socket.broadcast.emit('update waiting rooms', roomNames);
        }

        io.to(room.name).emit(
          'message',
          formatMessage(botName, `${player.username} has left the game`),
        );
        // Send players and room info when player leaves
        io.to(room.name).emit('update room players', {
          room: room.name,
          players: room.players,
        });
      }}
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.get('/player/:username', function (req, res) {
  const player = Player.getByUsername(req.params.username);
  console.log('---- Request player by username ----', player);
  res.status(200).json(player);
});

app.get('/rooms/waiting', function (req, res) {
  const rooms = Game.getWaitingRooms();
  const roomNames = rooms?.map(room => room.name);
  console.log('---- Request waiting rooms ----' );
  res.status(200).json(roomNames);
});

server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
