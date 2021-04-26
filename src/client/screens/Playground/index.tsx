import  React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';
import { View, Text } from 'react-native';
import useInterval from '@use-it/interval';
import { useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { SOCKETS, SCORING } from '/config/constants';
import { blankMatrix, blockMatrix, penaltyLine } from '/client/constants/tetriminos';
import { blockTypes } from '/client/constants/tetriminos';
import { ChatWidget, addResponseMessage, dropMessages } from '/client/components/Chat';
import Digits from '/client/components/Digits';
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
  const [block, setBlock] = useState<BlockType>(blockCreate({ type: _.sample(blockTypes) ?? 'T' }));
  const [matrix, setMatrix] = useState<Matrix>(blankMatrix);
  const [isPause, setIsPause] = useState<boolean>(true);
  const [player, setCurrentPlayer] = useState<PlayerType>();
  const [roomLeader, setRoomLeader] = useState<PlayerType>();
  const [gameover, setGameover] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
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

  const socketReceiveStartGame = ({ tilesStack, startTile }: { tilesStack: string[], startTile: string }) => {
    // TODO: assign tile stack here
    console.log('START_GAME', startTile, tilesStack, isPause);
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
      socketEmitUpdatePlayerScore();
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

    // Redirect player to ranking page after player.isWinner score was updated
    socket.on(SOCKETS.REDIRECT_TO_RANKING, socketReceiveRedirectToRanking);

    if (!isSoloMode) {
      // Message from server
      socket.on(SOCKETS.CHAT_MESSAGE, socketChatMessage);

      // When new players join the room
      socket.on(SOCKETS.UPDATE_ROOM_PLAYERS, socketUpdateRoomPlayers);

      // Receive block type and stack of 3 next blocks
      socket.on(SOCKETS.START_GAME, socketReceiveStartGame);

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

  // const nextBlockType = blockTypes[(_.indexOf(blockTypes, block.type) + 1) % _.size(blockTypes)];
  const nextBlockType = blockTypes[0]; // TODO: del after debugging
  useInterval(() => {
    if (isPause) return;
    // TODO: What condition do we have on playground screen? If not solo mode, check if user left Playground screen and stop pieces from falling (issue #66 in github)
    // if (!username) return; // If user left Playground screen
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
          return blockCreate({ type: nextBlockType });
        } else {
          return blockFall(currentBlock);
        }
      });
    }
  }, 500);

  return (
    <>
      <Gameboy isPause={isPause} setIsPause={setIsPause} roomPlayers={roomPlayersNames(roomPlayers)} isLeader={player?.isLeader} gameStarted={gameStarted} gameover={gameover} isSoloMode={isSoloMode}>
        <>
          {username && room &&
            <Text style={{ fontSize: 16, marginBottom: 10, alignSelf: 'flex-start' }}>{username} @ {room}</Text>
          }
          <View style={{ position: 'absolute', zIndex: 1, marginLeft: 600 }}>
            <Text>{player?.score}</Text>
            {_.map(filteredOpponents(roomPlayers, userContext.username || ''), (player) =>
              <View key={player.id} style={{ width: 85 }}>
                <View style={{ alignItems: 'center' }}><Text style={{ fontWeight: 'bold', color: 'white' }}>{player.username}</Text></View>
                <Matrix matrix={player.spectrum} isSpectrum={true} block={blockCreate({ type: nextBlockType, pos: [-10, -10] })}/>
              </View>)
            }
          </View>
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
                block={blockCreate({ type: nextBlockType, pos: [0, 0] })}
                style={{ borderWidth: 0, marginVertical: 10, alignSelf: 'flex-end' }}
              />
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
