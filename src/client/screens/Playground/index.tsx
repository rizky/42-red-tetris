import  React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { View, Text } from 'react-native';
import useInterval from '@use-it/interval';
import { useRoute, RouteProp } from '@react-navigation/native';
import io from 'socket.io-client';

import { blankMatrix, blockMatrix } from '/client/constants/tetriminos';
import { blockTypes } from '/client/constants/tetriminos';
import { ChatWidget, addResponseMessage } from '/client/components/Chat';
import Block from '/client/models/block';
import Digits from '/client/components/Digits';
import formatChatSubtitle from '/client/screens/Playground/utils';
import Gameboy from '/client/components/Gameboy';
import Matrix from '/client/components/Matrix';
import { useKeyEvent } from '/client/hooks/useKeyEvent';

export default function Playground(): JSX.Element {
  const route = useRoute<RouteProp<RootStackParamList, 'Playground'>>();
  const { params } = route;
  const { room, username } = params ?? {};
  const [roomUsers, setRoomUsers] = useState<string[]>([]);
  const [block, setBlock] = useState<Block>(new Block({ type: _.sample(blockTypes) ?? 'T' }));
  const [matrix, setMatrix] = useState<Matrix>(blankMatrix);
  const [isPause, setIsPause] = useState<boolean>(true);
  useKeyEvent({ setBlock, setMatrix, setIsPause });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let socket: any = null;

  // Initialize new socket
  useEffect(() => {
    socket = io(`${process.env.EXPO_SOCKET_URL}`);
  }, []);

  useEffect(() => {
    socket.emit('joinRoom', { username, roomName: room });
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
  const nextBlockType = blockTypes[(_.indexOf(blockTypes, block.type) + 1) % _.size(blockTypes)];
  useInterval(() => {
    if (isPause) return;
    if (_.includes(matrix[0], 1)) {
      setMatrix(blankMatrix);
      setIsPause(true);
    } else {
      setBlock((currentBlock) => {
        if (!block.fall().isValid(matrix)) {
          setMatrix(block.printBlock(matrix));
          return new Block({ type: nextBlockType });
        } else {
          return currentBlock.fall();
        }
      });
    }
  }, 500);

  return (
    <>
      <Gameboy isPause={isPause}>
        <View style={{ flexDirection: 'row', alignSelf:'flex-start', width: '100%' }}>
          <Matrix matrix={matrix} block={block}/>
          <View style={{ marginLeft: 20, flex: 1 }} >
            <Text style={{ fontSize: 20 }}>Score</Text>
            <Digits style={{ marginVertical: 10, alignSelf: 'flex-end' }} />
            <Text style={{ fontSize: 20 }}>Start Line</Text>
            <Digits style={{ marginVertical: 10, alignSelf: 'flex-end' }} />
            <Text style={{ fontSize: 20 }}>Level</Text>
            <Digits style={{ marginVertical: 10, alignSelf: 'flex-end' }} />
            <Text style={{ fontSize: 20 }}>Next</Text>
            <Matrix
              matrix={blockMatrix}
              block={new Block({ type: nextBlockType, pos: [0, 0] })}
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
