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

export default function Playground(): JSX.Element {
  const route = useRoute<RouteProp<RootStackParamList, 'Playground'>>();
  const { params } = route;
  const { room, username } = params ?? {};
  const [roomUsers, setRoomUsers] = useState<string[]>([]);
  const [block, setBlock] = useState<Block>(new Block({ type: _.sample(blockTypes) ?? 'T' }));
  const [matrix, setMatrix] = useState<Matrix>(blankMatrix);
  const [isPause, setIsPause] = useState<boolean>(true);
  useEffect(() => {
    socket.emit('joinRoom', { username, room });
    // Message from server
    socket.on('message', (message: Message) => {
      if (message.username !== username)
        addResponseMessage(message.username + ': ' + message.text, message.username);
    });
    socket.on('update room users', (data: { room: string, users: User[] }) => {
      setRoomUsers(data.users.map((user) => user.username));
    });
  }, []);
  const handleNewUserMessage = (message: string) => {
    socket.emit('chatMessage', message);
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
          setMatrix(block.destroyBlock(block.printBlock(matrix)));
          return new Block({ type: nextBlockType });
        } else {
          return currentBlock.fall();
        }
      });
    }
  }, 500);
  useKey((_key: number, { keyCode }: { keyCode: number }) => {
    if (keyCode === keyboard.pause) setIsPause((prevState) => !prevState);
    if (keyCode === keyboard.reset) {
      setBlock(new Block({ type: _.sample(blockTypes) ?? 'T' }));
      setMatrix(blankMatrix);
      setIsPause(true);
    }
    setIsPause((prevIsPause) => {
      setMatrix((prevMatrix) => {
        if (!prevIsPause) {
          if (keyCode === keyboard.rotate) {
            setBlock((currentBlock) => currentBlock.rotate().isValid(prevMatrix) ? currentBlock.rotate() : currentBlock);
          }
          if (keyCode === keyboard.left) {
            setBlock((currentBlock) => currentBlock.left().isValid(prevMatrix) ? currentBlock.left() : currentBlock);
          }
          if (keyCode === keyboard.right) {
            setBlock((currentBlock) => currentBlock.right().isValid(prevMatrix) ? currentBlock.right() : currentBlock);
          }
          if (keyCode === keyboard.down) {
            setBlock((currentBlock) => currentBlock.fall().isValid(prevMatrix) ? currentBlock.fall() : currentBlock);
          }
          if (keyCode === keyboard.space) {
            setBlock((currentBlock) => currentBlock.drop(prevMatrix));
          }
        }
        return prevMatrix;
      });
      return prevIsPause;
    });
  });
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
