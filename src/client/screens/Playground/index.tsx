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
  const [roomPlayers, setRoomPlayers] = useState<string[]>([]);
  const [block, setBlock] = useState<Block>(new Block({ type: _.sample(blockTypes) ?? 'T' }));
  const [matrix, setMatrix] = useState<Matrix>(blankMatrix);
  const [isPause, setIsPause] = useState<boolean>(true);
  const [player, setCurrentPlayer] = useState<PlayerType>();

  useKeyEvent({ setBlock, setMatrix, setIsPause, isLeader: player?.isLeader });

  console.log(player); // use player.isLeader to show/hide tetris buttons

  let socket: SocketIOClient.Socket | null = null;

  // Initialize new socket only on component mount
  useEffect(() => {
    socket = io(`${process.env.EXPO_SOCKET_URL}`);
    return () => {
      if(socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) throw Error('No socket');
    socket.emit('joinRoom', { username, roomName: room });

    // Message from server
    socket.on('message', (message: Message) => {
      if (message.username !== username)
        addResponseMessage(message.username + ': ' + message.text, message.username);
    });

    // Current player sent from server
    socket.on('fetch current player', (player: PlayerType) => {
      setCurrentPlayer(player);
    });

    socket.on('update room players', (data: { room: string, players: PlayerType[] }) => {
      setRoomPlayers(data.players.map((player) => player.username));
    });

    return () => {
      if(socket) socket.disconnect();
    };
  }, []);
  const handleNewUserMessage = (message: string) => {
    if (!socket) throw Error('No socket'); // TODO: socket never reaches here - fix
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
      <Gameboy isPause={isPause} player={player}>
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
        <ChatWidget title="RedTetris" subtitle={formatChatSubtitle(roomPlayers)} handleNewUserMessage={handleNewUserMessage}/>
      }
    </>
  );
}
