import  React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';
import { View, Text } from 'react-native';
import useInterval from '@use-it/interval';
import { useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { SOCKETS, SCORING } from '/config/constants';
import { blankMatrix, blockMatrix } from '/client/constants/tetriminos';
import { ChatWidget, dropMessages } from '/client/components/Chat';
import { formatChatSubtitle, formatChatTitle, roomPlayersNames, convertMatrixToSpectrum, filteredOpponents } from '/client/screens/Playground/utils';
import Gameboy from '/client/components/Gameboy';
import Matrix from '/client/components/Matrix';
import { useKeyEvent } from '/client/hooks/useKeyEvent';
import SocketContext from '/client/context/SocketContext';
import UserContext from '/client/context/UserContext';
import { blockCreate, blockFall, isBlockValid, printBlock, destroyBlock } from '/client/controllers/blockControllers';
import {
  socketEmitGameover,
  socketEmitMoreTetrisTiles,
  socketEmitNewUserMessage,
  socketEmitPenaltyRows,
  socketEmitUpdateSpectrum,
  socketReceiveChatMessage,
  socketReceiveCurrentPlayer,
  socketReceiveGameover,
  socketReceiveMoreTetrisTiles,
  socketReceivePauseGame,
  socketReceivePenaltyRows,
  socketReceiveRedirectToRanking,
  socketReceiveSpeedMode,
  socketReceiveStartGame,
  socketReceiveUpdateRoomPlayers,
  socketReceiveUpdateSpectrum,
} from './socketHandlers';

export default function Playground(): JSX.Element {
  const socket = useContext(SocketContext);
  const { userContext, setUserContext } = useContext(UserContext);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Root'>>();

  const route = useRoute<RouteProp<RootStackParamList, 'Playground'>>();
  const { params } = route;
  // const { room, username } = userContext;
  const { room, username } = params ?? {};
  const [roomPlayers, setRoomPlayers] = useState<PlayerType[]>([]);
  const [tileStack, setTileStack] = useState<TetriminosType[]>(['O']);
  const [block, setBlock] = useState<BlockType>(blockCreate({ type: tileStack[0] }));
  const [matrix, setMatrix] = useState<Matrix>(blankMatrix);
  const [isPause, setIsPause] = useState<boolean>(true);
  const [player, setCurrentPlayer] = useState<PlayerType>();
  const [roomLeader, setRoomLeader] = useState<PlayerType>();
  const [gameover, setGameover] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [speedMode, setSpeedMode] = useState<boolean>(false);
  const isSoloMode = _.includes(userContext.room, 'solo') || _.includes(room, 'solo'); // works both for context and URL params

  useKeyEvent({ setBlock, setMatrix, setIsPause });

  useEffect(() => {
    dropMessages();
    /*
    ** TODO: del next line when tmp SOCKETS.ENTER_ROOM by url params is deleted
    */
    if (!userContext.username || !userContext.room) setUserContext({ username, room }); // for components that use UserContext
    console.log('Playground, User context:', userContext);
    if (!socket) throw Error('No socket');

    /*
    ** TODO: uncomment when tmp SOCKETS.ENTER_ROOM by url params is deleted
    */
    // if (userContext.username && userContext.room) // If not solo mode, enter room
    socket.emit(SOCKETS.ENTER_ROOM, { username, roomName: room });

    // Current player sent from server
    socket.on(SOCKETS.FETCH_CURRENT_PLAYER, (player: PlayerType) => socketReceiveCurrentPlayer({ player, setCurrentPlayer }));

    // Receive block type and stack of 3 next blocks
    socket.on(SOCKETS.START_GAME, (tileStack: TetriminosType[]) => socketReceiveStartGame({ setTileStack, setGameStarted, setIsPause, tileStack}));

    // Redirect player to ranking page after player.isWinner score was updated
    socket.on(SOCKETS.REDIRECT_TO_RANKING, () => socketReceiveRedirectToRanking({ username, room, navigation }));

    // Receive more tetris tiles
    socket.on(SOCKETS.MORE_TETRIS_TILES, (tileStack: TetriminosType[]) => socketReceiveMoreTetrisTiles(tileStack, setTileStack));

    // Receive speed mode socket
    socket.on(SOCKETS.SPEED_MODE, () => socketReceiveSpeedMode(setSpeedMode));

    if (!isSoloMode) {
      // Message from server
      socket.on(SOCKETS.CHAT_MESSAGE, (message: Message) => socketReceiveChatMessage(message));

      // When new players join the room
      socket.on(SOCKETS.UPDATE_ROOM_PLAYERS, (data: { room: string, players: PlayerType[] }) => socketReceiveUpdateRoomPlayers({ setRoomPlayers, setRoomLeader, setCurrentPlayer, data }));

      // Pause playgound matrix
      socket.on(SOCKETS.PAUSE_GAME, () => socketReceivePauseGame(setIsPause));

      // Receive penalty rows
      socket.on(SOCKETS.PENALTY_ROWS, (rowsNumber: number) => socketReceivePenaltyRows({ setMatrix, rowsNumber }));

      // One of opponents has gameover
      socket.on(SOCKETS.GAMEOVER, (data: { players: PlayerType[], endGame: boolean }) => socketReceiveGameover({ setCurrentPlayer, setIsPause, setMatrix, setGameover, isSoloMode, socket, data }));

      // One of opponents updated his spectrum
      socket.on(SOCKETS.UPDATE_SPECTRUM, (roomPlayers: PlayerType[]) => socketReceiveUpdateSpectrum(roomPlayers, setRoomPlayers));
    }
    
    return () => {
      socket.emit(SOCKETS.PLAYER_LEFT, username);

      socket.removeListener(SOCKETS.CHAT_MESSAGE, socketReceiveChatMessage);
      socket.removeListener(SOCKETS.FETCH_CURRENT_PLAYER, socketReceiveCurrentPlayer);
      socket.removeListener(SOCKETS.UPDATE_ROOM_PLAYERS, socketReceiveUpdateRoomPlayers);
      socket.removeListener(SOCKETS.START_GAME, socketReceiveStartGame);
      socket.removeListener(SOCKETS.PAUSE_GAME, socketReceivePauseGame);
      socket.removeListener(SOCKETS.PENALTY_ROWS, socketReceivePenaltyRows);
      socket.removeListener(SOCKETS.GAMEOVER, socketReceiveGameover);
      socket.removeListener(SOCKETS.UPDATE_SPECTRUM, socketReceiveUpdateSpectrum);
      socket.removeListener(SOCKETS.MORE_TETRIS_TILES, socketReceiveMoreTetrisTiles);
      socket.removeListener(SOCKETS.SPEED_MODE, socketReceiveSpeedMode);
      socket.removeListener(SOCKETS.REDIRECT_TO_RANKING, socketReceiveRedirectToRanking);
      dropMessages();
    };
  }, []);

  useInterval(() => {
    if (isPause) return;
    if (_.includes(matrix[0], 1)) {
      setMatrix(blankMatrix);
      setIsPause(true);
      setGameover(true);
      socketEmitGameover({ isSoloMode, setCurrentPlayer, userContext, socket });
    } else {
      setBlock((currentBlock) => {
        if (!isBlockValid(blockFall(currentBlock), matrix)) {
          const { newMatrix, deletedRows } = destroyBlock(printBlock(block, matrix));
          setMatrix(newMatrix);
          // if (deletedRows > 1)
          if (deletedRows > 0) // TODO: del after debugging
          //   socketEmitPenaltyRows(deletedRows - 1);
            socketEmitPenaltyRows({ rowsNumber: deletedRows, username, roomName: room, socket }); // TODO: del after debugging

          socketEmitUpdateSpectrum({ spectrum: convertMatrixToSpectrum(newMatrix),  userContext, socket });

          // Update player in state each time he gains score
          setCurrentPlayer((prevCurrentPlayer) => {
            if (!prevCurrentPlayer) return;
            const playerWithUpdatedScore = { ...prevCurrentPlayer, score: prevCurrentPlayer.score + SCORING.PIECE_PLACED + SCORING.ROW_DESTROYED * deletedRows };
            return playerWithUpdatedScore;
          });

          // Remove tileStack[0] that was just placed on the bottom
          setTileStack((prevTileStack) => {
            if (prevTileStack.length < 4) {
              socketEmitMoreTetrisTiles(userContext, socket);
            }
            return _.drop(prevTileStack);
          });

          return blockCreate({ type: tileStack[0] });
        } else {
          return blockFall(currentBlock);
        }
      });
    }
  }, speedMode ? 200 : 500);

  return (
    <>
      <Gameboy isPause={isPause} setIsPause={setIsPause} roomPlayers={roomPlayersNames(roomPlayers)} isLeader={player?.isLeader} gameStarted={gameStarted} gameover={gameover} isSoloMode={isSoloMode} speedMode={speedMode}>
        <>
          {username && room &&
            <Text style={{ fontSize: 16, marginBottom: 5, alignSelf: 'flex-start' }}>{username} @ {room}</Text>
          }
          <View style={{ flexDirection: 'row', alignSelf:'flex-start', width: '100%' }}>
            <Matrix matrix={matrix} block={block}/>
            <View style={{ marginLeft: 10, flex: 1, justifyContent: 'space-around' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20 }}>Score</Text>
                <Text style={{ fontSize: 30, fontFamily: 'Digital', marginLeft: 10 }}>{player?.score || 0}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20 }}>Next</Text>
                <Matrix
                  matrix={blockMatrix}
                  block={blockCreate({ type: tileStack[0], pos: [0, 0] })}
                  style={{ marginLeft: 10, borderWidth: 0, marginVertical: 10 }}
                />
              </View>
              {roomPlayers.length - 1 > 0 &&
                <View style={{ height: roomPlayers.length > 2 ? 355 : 180, width: 175, flexWrap: 'wrap', alignContent: 'space-between' }}>
                  {_.map(filteredOpponents(roomPlayers, userContext.username || ''), (player) =>
                    <View key={player.id} style={{ width: 85 }}>
                      <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{player.username}</Text>
                      </View>
                      <Matrix
                        matrix={player.spectrum}
                        isSpectrum={true}
                        block={blockCreate({ type: tileStack[0], pos: [-10, -10] })}
                        style={{ borderWidth: 0 }}
                      />
                    </View>)
                  }
                </View>
              }
            </View>
          </View>
        </>
      </Gameboy>
      {!isSoloMode &&
        <ChatWidget title={formatChatTitle(roomLeader?.username ?? 'no leader')} subtitle={formatChatSubtitle(roomPlayersNames(roomPlayers))} handleNewUserMessage={(message: string) => socketEmitNewUserMessage({ message, socket, username, roomName: room })}/>
      }
    </>
  );
}
