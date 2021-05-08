import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import socketio from 'socket.io';
import dotenv from 'dotenv';

import { Player } from './models/Player';
import { Game } from './models/Game';
import { Room } from './models/Room';
import connectSocketIO from './controllers/Socket';

dotenv.config();

const PORT = process.env.PORT || process.env.PORT_SERVER;

export const app = express();
const server = http.createServer(app);

const io = socketio(server, {
  pingTimeout: 6000,
});

app.set('io', io); // anywhere in routes we should be able to get socket with `let io = app.get('io');`

// Init socket script
connectSocketIO(io);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.get('/player/:username', (req, res) => {
  const player = Player.getByUsername(req.params.username);
  res.status(200).json(player);
});

app.get('/room/:name', (req, res) => {
  const room = Room.getByName(req.params.name);
  res.status(200).json(room);
});

app.get('/rooms/waiting', (req, res) => { // TODO: Never used, rm?
  const rooms = Game.getWaitingRooms();
  const roomNames = rooms?.map(room => room.name);
  console.log('---- Request waiting rooms ----' );
  res.status(200).json(roomNames);
});

server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
