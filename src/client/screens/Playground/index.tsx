import  React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';
import { View, Text } from 'react-native';
import useInterval from '@use-it/interval';
import { useRoute, RouteProp } from '@react-navigation/native';

import { SOCKETS } from '/config/constants';
import { blankMatrix, blockMatrix } from '/client/constants/tetriminos';
import { blockTypes } from '/client/constants/tetriminos';
import { ChatWidget, addResponseMessage } from '/client/components/Chat';
import Block from '/client/models/block';
import Digits from '/client/components/Digits';
import formatChatSubtitle from '/client/screens/Playground/utils';
import Gameboy from '/client/components/Gameboy';
import Matrix from '/client/components/Matrix';
import { useKeyEvent } from '/client/hooks/useKeyEvent';
import SocketContext from '/client/context/SocketContext';
import UserContext from '/client/context/UserContext';

export default function Playground(): JSX.Element {  
  const socket = useContext(SocketContext);
  const { userContext } = useContext(UserContext);
  console.log('Playground, User context:', userContext);


  // TODO: delete Playground routes everywhere
  // const route = useRoute<RouteProp<RootStackParamList, 'Playground'>>();
  // const { params } = route;
  const { room, username } = userContext;
  // const { room, username } = params ?? {};
  const [roomPlayers, setRoomPlayers] = useState<string[]>([]);
  const [block, setBlock] = useState<Block>(new Block({ type: _.sample(blockTypes) ?? 'T' }));
  const [matrix, setMatrix] = useState<Matrix>(blankMatrix);
  const [isPause, setIsPause] = useState<boolean>(true);
  const [player, setCurrentPlayer] = useState<PlayerType>();

  useKeyEvent({ setBlock, setMatrix, setIsPause });

  useEffect(() => {
    if (!socket) throw Error('No socket');
    if (userContext.username && userContext.room) // If not solo mode, enter room
      socket.emit(SOCKETS.ENTER_ROOM, { username, roomName: room });

    // Message from server
    socket.on(SOCKETS.CHAT_MESSAGE, (message: Message) => {
      if (message.username !== username)
        addResponseMessage(message.username + ': ' + message.text, message.username);
    });

    // Current player sent from server
    socket.on(SOCKETS.FETCH_CURRENT_PLAYER, (player: PlayerType) => {
      setCurrentPlayer(player);
      console.log('FETCH_CURRENT_PLAYER', player); // TODO: use player.isLeader to show/hide tetris buttons
    });

    socket.on(SOCKETS.UPDATE_ROOM_PLAYERS, (data: { room: string, players: PlayerType[] }) => {
      setRoomPlayers(data.players.map((player) => player.username));
    });

    return () => {
      if(socket) socket.emit(SOCKETS.PLAYER_LEFT, username);
    };
  }, []);

  const handleNewUserMessage = (message: string) => {
    if (!socket) throw Error('No socket');
    socket.emit(SOCKETS.CHAT_MESSAGE, { username, message, room });
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
      <Gameboy isPause={isPause} roomPlayers={roomPlayers} isLeader={player?.isLeader}>
        <>
          {username && room &&
          <Text style={{ fontSize: 16, marginBottom: 10, alignSelf: 'flex-start' }}>{username} @ {room}</Text>}
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
        </>
      </Gameboy>
      {room && username &&
        <ChatWidget title="RedTetris" subtitle={formatChatSubtitle(roomPlayers)} handleNewUserMessage={handleNewUserMessage}/>
      }
    </>
  );
}
