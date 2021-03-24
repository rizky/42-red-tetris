import  React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';
import { View, Text } from 'react-native';
import useInterval from '@use-it/interval';
import { useRoute, RouteProp } from '@react-navigation/native';

import { SOCKETS } from '/config/constants';
import { blankMatrix, blockMatrix, penaltyLine } from '/client/constants/tetriminos';
import { blockTypes } from '/client/constants/tetriminos';
import { ChatWidget, addResponseMessage } from '/client/components/Chat';
import Block from '/client/models/block';
import Digits from '/client/components/Digits';
import { formatChatSubtitle, formatChatTitle } from '/client/screens/Playground/utils';
import Gameboy from '/client/components/Gameboy';
import Matrix from '/client/components/Matrix';
import { useKeyEvent } from '/client/hooks/useKeyEvent';
import SocketContext from '/client/context/SocketContext';
import UserContext from '/client/context/UserContext';

export default function Playground(): JSX.Element {
  const socket = useContext(SocketContext);
  const { userContext, setUserContext } = useContext(UserContext);

  const route = useRoute<RouteProp<RootStackParamList, 'Playground'>>();
  const { params } = route;
  // const { room, username } = userContext;
  const { room, username } = params ?? {};
  const [roomPlayers, setRoomPlayers] = useState<string[]>([]);
  const [block, setBlock] = useState<Block>(new Block({ type: _.sample(blockTypes) ?? 'T' }));
  const [matrix, setMatrix] = useState<Matrix>(blankMatrix);
  const [isPause, setIsPause] = useState<boolean>(true);
  const [player, setCurrentPlayer] = useState<PlayerType>();
  const [roomLeader, setRoomLeader] = useState<PlayerType>();

  useKeyEvent({ setBlock, setMatrix, setIsPause });

  const socketChatMessage = (message: Message) => {
    addResponseMessage(message.username + ': ' + message.text, message.username);
  };
  
  const socketFetchCurrentPlayer = (player: PlayerType) => {
    setCurrentPlayer(player);
    console.log('FETCH_CURRENT_PLAYER', player); // TODO: use player.isLeader to show/hide tetris buttons
  };

  const socketUpdateRoomPlayers = (data: { room: string, players: PlayerType[] }) => {
    setRoomPlayers(data.players.map((player) => player.username));
    
    // When old leader leaves the room, we set a new leader
    // And if new room leader and this room player are the same user, we update isLeader in player (or update the whole player)
    const newLeader = _.find(data.players, (player) => player.isLeader);
    setRoomLeader(newLeader);
    setCurrentPlayer((prevCurrentPlayer) => {
      if (prevCurrentPlayer && newLeader && prevCurrentPlayer.id === newLeader.id) {
        return newLeader;
      }
      return prevCurrentPlayer;
    });
  };

  const socketStartGame = ({ tilesStack, startTile }: { tilesStack: string[], startTile: string }) => {
    console.log('START_GAME', startTile, tilesStack, isPause);
    // TODO: smth to separate START_GAME from PAUSE
    setIsPause(false);
  };

  const socketEmitPenaltyRows = (rowsNumber: number) => {
    if (!socket) throw Error('No socket');
    console.log('PENALTY_ROWS emit, rowsNumber:', rowsNumber);
    socket.emit(SOCKETS.PENALTY_ROWS, { username, roomName: room, rowsNumber });
  };

  const socketReceivePenaltyRows = (rowsNumber: number) => {
    setMatrix((prevMatrix) => {
      const newMatrix = addPenaltyRows(prevMatrix, rowsNumber);
      console.log('PENALTY_ROWS receive. rowsNumber, newMatrix:', rowsNumber, newMatrix);
      return newMatrix;
    });
  };

  useEffect(() => {
    /*
    ** TODO: del next line when tmp SOCKETS.ENTER_ROOM by url params is deleted
    */
    setUserContext({ username, room }); // for components that use UserContext
    console.log('Playground, User context:', userContext);
    if (!socket) throw Error('No socket');
    /*
    ** TODO: uncomment when tmp SOCKETS.ENTER_ROOM by url params is deleted
    */
    // if (userContext.username && userContext.room) // If not solo mode, enter room
    socket.emit(SOCKETS.ENTER_ROOM, { username, roomName: room });

    // Message from server
    socket.on(SOCKETS.CHAT_MESSAGE, socketChatMessage);

    // Current player sent from server
    socket.on(SOCKETS.FETCH_CURRENT_PLAYER, socketFetchCurrentPlayer);

    // When new players join the room
    socket.on(SOCKETS.UPDATE_ROOM_PLAYERS, socketUpdateRoomPlayers);

    // Receive block type and stack of 3 next blocks
    socket.on(SOCKETS.START_GAME, socketStartGame);

    // Receive penalty rows
    socket.on(SOCKETS.PENALTY_ROWS, socketReceivePenaltyRows);
    return () => {
      socket.emit(SOCKETS.PLAYER_LEFT, username);

      socket.removeListener(SOCKETS.CHAT_MESSAGE, socketChatMessage);
      socket.removeListener(SOCKETS.FETCH_CURRENT_PLAYER, socketFetchCurrentPlayer);
      socket.removeListener(SOCKETS.UPDATE_ROOM_PLAYERS, socketUpdateRoomPlayers);
      socket.removeListener(SOCKETS.START_GAME, socketStartGame);
      socket.removeListener(SOCKETS.PENALTY_ROWS, socketReceivePenaltyRows);
    };
  }, []);

  const handleNewUserMessage = (message: string) => {
    if (!socket) throw Error('No socket');
    socket.emit(SOCKETS.CHAT_MESSAGE, { username, message, roomName: room });
  };

  const addPenaltyRows = (matrix: Matrix, rowsNumber: number): Matrix => {
    // Create array of blank lines
    const penaltyMatrix = Array(rowsNumber).fill(penaltyLine);
    // Add it to the bottom of matrix (matrix has 20 + rowsNumber lines)
    const newMatrix = _.cloneDeep([...matrix, ...penaltyMatrix]);
    // Return matrix without N start lines (matrix has 20 lines again)
    return _.slice(newMatrix, rowsNumber, newMatrix.length);
  };

  // const nextBlockType = blockTypes[(_.indexOf(blockTypes, block.type) + 1) % _.size(blockTypes)];
  const nextBlockType = blockTypes[0]; // TODO: del after debugging
  useInterval(() => {
    if (isPause) return;
    // TODO: What condition do we have on playground screen? If not solo mode, check if user left Playground screen and stop pieces from falling (issue #66 in github)
    // if (!username) return; // If user left Playground screen
    if (_.includes(matrix[0], 1)) {
      setMatrix(blankMatrix);
      setIsPause(true);
      console.log('GAME_OVER!!!!!'); // TODO: Game Over here
    } else {
      setBlock((currentBlock) => {
        if (!block.fall().isValid(matrix)) {
          const { newMatrix, deletedRows } = block.destroyBlock(block.printBlock(matrix));
          setMatrix(newMatrix);
          // if (deletedRows > 1)
          if (deletedRows > 0) // TODO: del after debugging
          //   socketEmitPenaltyRows(deletedRows - 1);
            socketEmitPenaltyRows(deletedRows); // TODO: del after debugging

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
        <ChatWidget title={formatChatTitle(roomLeader?.username ?? 'no leader')} subtitle={formatChatSubtitle(roomPlayers)} handleNewUserMessage={handleNewUserMessage}/>
      }
    </>
  );
}
