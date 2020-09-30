// import io from 'socket.io-client';

// let socket;

// export const initiateSocket = (socket, room) => {
//   const socket = io(`${process.env.EXPO_SOCKET_URL}`);
//   console.log('Connecting socket...', socket);
//   if (socket && room) {
//     socket.emit('join room', room);
//     console.log('emit - YES');
//   }
// };

// export const disconnectSocket = (socket) => {
//   console.log('Disconnecting socket...');
//   if(socket) socket.disconnect();
// };

// // What the f this f does?
// export const subscribeToChat = (socket, cb) => {
//   if (!socket) {
//     console.log('NO Socket!!!!!!!!!!!!!!!');
//     return('No socket!', null);
//   }

//   socket.on('receive message', msg => {
//     console.log('Websocket event received!');
//     return cb(null, msg);
//   });
// };

// export const sendMessage = (socket, room, message) => {
//   if (socket) {
//     console.log('hey hey', message, room);
//     socket.emit('new message', { message, room });
//     return true;
//   }
//   else {
//     console.log('NO Socket');
//     return false;
//   }
// };
