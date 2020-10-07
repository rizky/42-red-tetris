import  React, { useState, useEffect } from 'react';
import _ from 'lodash';
import 'react-chat-widget/lib/styles.css';
import { View, Text } from 'react-native';
import { Widget as ChatWidget, addResponseMessage } from 'react-chat-widget';
import useInterval from '@use-it/interval';
import useKey from 'use-key-hook';
import { useRoute, RouteProp } from '@react-navigation/native';
import io from 'socket.io-client';

import { blankMatrix, blockMatrix } from '/client/constants/tetriminos';
import { blockTypes } from '/client/constants/tetriminos';
import { keyboard } from '/client/constants/keyboard';
import Block from '/client/models/block';
import Digits from '/client/components/Digits';
import formatChatSubtitle from '/client/screens/Playground/utils';
import Gameboy from '/client/components/Gameboy';
import Matrix from '/client/components/Matrix';

// Initialize new socket
const socket = io(`${process.env.EXPO_SOCKET_URL}`);

const printBlock = (matrix: Matrix, block: Block) => { 
  const { shape, pos } = block;
  shape.forEach((row, rowIndex) => (
    row.forEach((col, colIndex) => {
      if (pos[0] + rowIndex >= 0 && pos[0] + rowIndex < 20 && pos[1] + colIndex < 10) {
        matrix[pos[0] + rowIndex][pos[1] + colIndex] = shape[rowIndex][colIndex];
      }
    })
  ));
  return matrix;
};

export default function Playground(): JSX.Element {
  const route = useRoute<RouteProp<RootStackParamList, 'Playground'>>();
  const { params } = route;
  const { room, username } = params ?? {};
  const [roomUsers, setRoomUsers] = useState<string[]>([]);
  
  useEffect(() => {
    socket.emit('joinRoom', { username, room });
    // Message from server
    socket.on('message', (message: Message) => {
      if (message.username !== username)
        addResponseMessage(message.username + ': ' + message.text, message.username);
    });
    socket.on('update room users', (data: { room: string, users: UserType[] }) => {
      setRoomUsers(data.users.map((user) => user.username));
    });
  }, []);
  const handleNewUserMessage = (message: string) => {
    socket.emit('chatMessage', { username, message, room });
  };
  const [block, setBlock] = useState<Block>(new Block({
    type: _.sample<TetriminosType>(blockTypes) ?? 'T',
  }));
  const nextBlockType = blockTypes[(_.indexOf(blockTypes, block.type) + 1) % _.size(blockTypes)];
  useInterval(() => {
    setBlock((currentBlock) =>
      (currentBlock.pos[0] + currentBlock.shape.length < 20)
        ? currentBlock.fall()
        : new Block({ type: nextBlockType }));
  }, 500);
  useKey((key: number) => {
    if (key === keyboard.rotate) setBlock((currentBlock) => currentBlock.rotate());
    if (key === keyboard.left) setBlock((currentBlock) => currentBlock.left());
    if (key === keyboard.right) setBlock((currentBlock) => currentBlock.right());
    if (key === keyboard.down) setBlock((currentBlock) => currentBlock.fall());
  });
  const newMatrix = printBlock(blankMatrix(), block);
  return (
    <>
      <Gameboy>
        <View style={{ flexDirection: 'row', alignSelf:'flex-start', width: '100%' }}>
          <Matrix matrix={newMatrix} />
          <View style={{ marginLeft: 20, flex: 1 }} >
            <Text style={{ fontSize: 20 }}>Score</Text>
            <Digits style={{ marginVertical: 10, alignSelf: 'flex-end' }} />
            <Text style={{ fontSize: 20 }}>Start Line</Text>
            <Digits style={{ marginVertical: 10, alignSelf: 'flex-end' }} />
            <Text style={{ fontSize: 20 }}>Level</Text>
            <Digits style={{ marginVertical: 10, alignSelf: 'flex-end' }} />
            <Text style={{ fontSize: 20 }}>Next</Text>
            <Matrix
              matrix={_.take(_.merge(blockMatrix(), new Block({ type: nextBlockType }).shape), 2)}
              style={{ borderWidth: 0, marginVertical: 10, alignSelf: 'flex-end' }}
            />
          </View>
        </View>
      </Gameboy>
      {room && username &&
        <ChatWidget title="RedTetris" subtitle={formatChatSubtitle(roomUsers)} handleNewUserMessage={handleNewUserMessage}/>
      }
    </>
  );
}
