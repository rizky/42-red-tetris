import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// import { initiateSocket, disconnectSocket, subscribeToChat, sendMessage } from '/utils/sockets';

let socket = io(`${process.env.EXPO_SOCKET_URL}`); // Initialize socket on page load

const TestSockets = (): JSX.Element => {
  const rooms = ['A', 'B', 'C'];
  const [room, setRoom] = useState(rooms[0]);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState(['send me a message']);

  useEffect(() => {// only log chat messages if chat changes
    console.log('Chat msges:', chat);
  }, [chat]);

  useEffect(() => {
    console.log('Room is:', room);
  }, [room]);

  // TODO: test linter plugin with `if`. Fix hooks linter plugin
  useEffect(() => {
    socket = io(`${process.env.EXPO_SOCKET_URL}`); // Create new socket each time I change room
    if (socket && room) socket.emit('join room', room);

    socket.on('receive message', (message: string) => { 
      setChat(prevMessages => [message, ...prevMessages]);
    });

    return () => {
      if(socket) socket.disconnect();
    };
  }, [room]);

  const onSendButtonClick = () => {
    socket.emit('new message', { message, room });
    setChat(prevMessages => [message, ...prevMessages]);
    setMessage('');
  };

  return (
    <div style={{ margin: 30 }}>
      <h1> Room: {room} </h1>
      { rooms.map((room, index) =>
        <button onClick={() => setRoom(room)} key={index}>
          {room}
        </button>
      )}
      <h1> Live Chat: </h1>
      <input
        type="text"
        name="name"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button onClick={onSendButtonClick}> Send </button>
      { chat.map((message, index) => <p key={index}>{message}</p>) }
    </div>
  );
};

export default TestSockets;
