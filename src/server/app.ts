import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pause from 'connect-pause';
import routes from './routes/index';
import http from 'http';
import socketio from 'socket.io';

const PORT = process.env.PORT_SERVER;

const app = express();
const server = http.createServer(app);

const io = socketio(server, {
  pingTimeout: 6000,
});

app.set('io', io); // anywhere in routes we should be able to get socket with `let io = app.get("io");`

io.on('connection', (socket) => {
  console.log(`Connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Disconnected: ${socket.id}`);
  });

  socket.on('join room', (room) => {
    console.log(`Socket ${socket.id} joining ${room}`);
    socket.join(room);
  });

  socket.on('new message', (data) => {
    const { message, room } = data;
    console.log(`msg: ${message}, room: ${room}`);
  
    // `broadcast.to` sends to everyone in room except sender
    // `io.to` sends to everyone in room
    socket.broadcast.to(room).emit('receive message', message);
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Simulate delay
app.use(pause(1000));
app.use(cors());
app.use('/', routes);

server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

