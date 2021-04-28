import  React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';
import { View, Text } from 'react-native';
import useInterval from '@use-it/interval';
import { useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { SOCKETS, SCORING } from '/config/constants';
import { blankMatrix, blockMatrix, penaltyLine } from '/client/constants/tetriminos';
import { ChatWidget, addResponseMessage, dropMessages } from '/client/components/Chat';
import { formatChatSubtitle, formatChatTitle, roomPlayersNames, convertMatrixToSpectrum } from '/client/screens/Playground/utils';
import Gameboy from '/client/components/Gameboy';
import Matrix from '/client/components/Matrix';
import { useKeyEvent } from '/client/hooks/useKeyEvent';
import SocketContext from '/client/context/SocketContext';
import UserContext from '/client/context/UserContext';
import { blockCreate, blockFall, isBlockValid, printBlock, destroyBlock } from '/client/controllers/blockControllers';

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

  const filteredOpponents = (roomPlayers: PlayerType[], currentPlayerUsername: string) => {
    return _.filter(roomPlayers, (player) => player.username !== currentPlayerUsername);
  };

  useKeyEvent({ setBlock, setMatrix, setIsPause });

  const socketChatMessage = (message: Message) => {
    addResponseMessage(message.username + ': ' + message.text, message.username);
  };
  
  const handleNewUserMessage = (message: string) => {
    if (!socket) throw Error('No socket');
    socket.emit(SOCKETS.CHAT_MESSAGE, { username, message, roomName: room });
  };

  const socketFetchCurrentPlayer = (player: PlayerType) => {
    setCurrentPlayer(player);
    console.log('FETCH_CURRENT_PLAYER', player);
  };

  const socketUpdateRoomPlayers = (data: { room: string, players: PlayerType[] }) => {
    setRoomPlayers(data.players);
    
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

  const socketReceiveStartGame = (tileStack: TetriminosType[]) => {
    // TODO: assign tile stack here
    console.log('START_GAME', tileStack, isPause);
    setTileStack(tileStack);
    setGameStarted(true);
    setIsPause(false);
  };

  const socketReceivePauseGame = () => {
    setIsPause(prevState => !prevState);
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
  
  const socketEmitUpdatePlayerScore = () => {
    if (!socket) throw Error('No socket');

    setCurrentPlayer((prevCurrentPlayer) => {
      if (!prevCurrentPlayer) return;
      socket.emit(SOCKETS.UPDATE_SCORE, { username: prevCurrentPlayer.username, roomName: prevCurrentPlayer.room, score: prevCurrentPlayer.score, isSoloMode });
      return prevCurrentPlayer;
    });
  };

  const socketReceiveRedirectToRanking = () => {
    navigation.push('Ranking', { username, room });
  };

  const socketEmitGameover = () => {
    if (isSoloMode) {
      return socketEmitUpdatePlayerScore();
    } else {
      if (!socket) throw Error('No socket');
      socket.emit(SOCKETS.GAMEOVER, { username: userContext.username, roomName: userContext.room });
    }
  };

  const socketReceiveGameover = ({ players, endGame }: { players: PlayerType[], endGame: boolean }) => {
    const roomWinner = _.find(players, (player) => player.isWinner);

    setCurrentPlayer((prevCurrentPlayer) => {
      if (prevCurrentPlayer && roomWinner && roomWinner.username === prevCurrentPlayer.username) {
        const playerWithUpdatedScore = { ...prevCurrentPlayer, score: prevCurrentPlayer.score + SCORING.LAST_PLAYER };
        return playerWithUpdatedScore;
      }
      return prevCurrentPlayer;
    });

    if (endGame) {
      socketEmitUpdatePlayerScore();
      setIsPause(true);
      setMatrix(blankMatrix);
      setGameover(true);
    }
  };

  const socketEmitUpdateSpectrum = (spectrum: Matrix) => {
    if (!socket) throw Error('No socket');
    socket.emit(SOCKETS.UPDATE_SPECTRUM, { username: userContext.username, roomName: userContext.room, spectrum });
  };

  const socketReceiveUpdateSpectrum = (roomPlayers: PlayerType[]) => {
    console.log('SOCKET.UPDATE_SPECTRUM, roomPlayers', roomPlayers);
    setRoomPlayers(roomPlayers);
  };

  const socketEmitMoreTetrisTiles = () => {
    if (!socket) throw Error('No socket');
    socket.emit(SOCKETS.MORE_TETRIS_TILES, { username: userContext.username, roomName: userContext.room });
  };

  const socketReceiveMoreTetrisTiles = (tileStack: TetriminosType[]) => {
    setTileStack((prevTileStack) => [...prevTileStack, ...tileStack]);
  };

  const socketReceiveSpeedMode = () => {
    setSpeedMode((prevSpeedMode) => !prevSpeedMode);
  };

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
    socket.on(SOCKETS.FETCH_CURRENT_PLAYER, socketFetchCurrentPlayer);

    // Receive block type and stack of 3 next blocks
    socket.on(SOCKETS.START_GAME, socketReceiveStartGame);

    // Redirect player to ranking page after player.isWinner score was updated
    socket.on(SOCKETS.REDIRECT_TO_RANKING, socketReceiveRedirectToRanking);

    // Receive more tetris tiles
    socket.on(SOCKETS.MORE_TETRIS_TILES, socketReceiveMoreTetrisTiles);

    // Receive speed mode socket
    socket.on(SOCKETS.SPEED_MODE, socketReceiveSpeedMode);

    if (!isSoloMode) {
      // Message from server
      socket.on(SOCKETS.CHAT_MESSAGE, socketChatMessage);

      // When new players join the room
      socket.on(SOCKETS.UPDATE_ROOM_PLAYERS, socketUpdateRoomPlayers);

      // Pause playgound matrix
      socket.on(SOCKETS.PAUSE_GAME, socketReceivePauseGame);

      // Receive penalty rows
      socket.on(SOCKETS.PENALTY_ROWS, socketReceivePenaltyRows);

      // One of opponents has gameover
      socket.on(SOCKETS.GAMEOVER, socketReceiveGameover);

      // One of opponents updated his spectrum
      socket.on(SOCKETS.UPDATE_SPECTRUM, socketReceiveUpdateSpectrum);
    }
    return () => {
      socket.emit(SOCKETS.PLAYER_LEFT, username);

      socket.removeListener(SOCKETS.CHAT_MESSAGE, socketChatMessage);
      socket.removeListener(SOCKETS.FETCH_CURRENT_PLAYER, socketFetchCurrentPlayer);
      socket.removeListener(SOCKETS.UPDATE_ROOM_PLAYERS, socketUpdateRoomPlayers);
      socket.removeListener(SOCKETS.START_GAME, socketReceivePauseGame);
      socket.removeListener(SOCKETS.PAUSE_GAME, socketReceiveStartGame);
      socket.removeListener(SOCKETS.PENALTY_ROWS, socketReceivePenaltyRows);
      socket.removeListener(SOCKETS.GAMEOVER, socketReceiveGameover);
      socket.removeListener(SOCKETS.UPDATE_SPECTRUM, socketReceiveUpdateSpectrum);
      socket.removeListener(SOCKETS.REDIRECT_TO_RANKING, socketReceiveRedirectToRanking);
      dropMessages();
    };
  }, []);

  const addPenaltyRows = (matrix: Matrix, rowsNumber: number): Matrix => {
    // Create array of blank lines
    const penaltyMatrix = Array(rowsNumber).fill(penaltyLine);
    // Add it to the bottom of matrix (matrix has 20 + rowsNumber lines)
    const newMatrix = _.cloneDeep([...matrix, ...penaltyMatrix]);
    // Return matrix without N start lines (matrix has 20 lines again)
    return _.slice(newMatrix, rowsNumber, newMatrix.length);
  };

  useInterval(() => {
    if (isPause) return;
    if (_.includes(matrix[0], 1)) {
      setMatrix(blankMatrix);
      setIsPause(true);
      setGameover(true);
      socketEmitGameover();
    } else {
      setBlock((currentBlock) => {
        if (!isBlockValid(blockFall(currentBlock), matrix)) {
          const { newMatrix, deletedRows } = destroyBlock(printBlock(block, matrix));
          setMatrix(newMatrix);
          // if (deletedRows > 1)
          if (deletedRows > 0) // TODO: del after debugging
          //   socketEmitPenaltyRows(deletedRows - 1);
            socketEmitPenaltyRows(deletedRows); // TODO: del after debugging

          socketEmitUpdateSpectrum(convertMatrixToSpectrum(newMatrix));

          // Update player in state each time he gains score
          setCurrentPlayer((prevCurrentPlayer) => {
            if (!prevCurrentPlayer) return;
            const playerWithUpdatedScore = { ...prevCurrentPlayer, score: prevCurrentPlayer.score + SCORING.PIECE_PLACED + SCORING.ROW_DESTROYED * deletedRows };
            return playerWithUpdatedScore;
          });

          // Remove tileStack[0] that was just placed on the bottom
          setTileStack((prevTileStack) => {
            if (prevTileStack.length < 4) {
              socketEmitMoreTetrisTiles();
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

  // TODO: rm after debugging
  // const fakePlayersSpectrums = [{id: '1', username: 'a', spectrum: blankMatrix}, {id: '2', username: 'b', spectrum: blankMatrix}, {id: '3', username: 'c', spectrum: blankMatrix}, {id: '4', username: 'd', spectrum: blankMatrix}];

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
        <ChatWidget title={formatChatTitle(roomLeader?.username ?? 'no leader')} subtitle={formatChatSubtitle(roomPlayersNames(roomPlayers))} handleNewUserMessage={handleNewUserMessage}/>
      }
    </>
  );
}
