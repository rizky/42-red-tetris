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

// From socket io docs, will delete later
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('join', (room) => {
    console.log(`Socket ${socket.id} joining ${room}`);
    socket.join(room);
  });

  socket.on('chat', (data) => {
    const { message, room } = data;
    console.log(`msg: ${message}, room: ${room}`);
    io.to(room).emit('chat', message);
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Simulate delay
app.use(pause(1000));
app.use(cors());
app.use('/', routes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

