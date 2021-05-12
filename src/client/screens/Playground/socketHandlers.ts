import _ from 'lodash';
import { Dispatch, SetStateAction } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';

import { SOCKETS, SCORING } from '/config/constants';
import { addResponseMessage } from '/client/components/Chat';
import { penaltyLine, blankMatrix } from '/client/constants/tetriminos';

const addPenaltyRows = (matrix: Matrix, rowsNumber: number): Matrix => {
  // Create array of blank lines
  const penaltyMatrix = Array(rowsNumber).fill(penaltyLine);
  // Add it to the bottom of matrix (matrix has 20 + rowsNumber lines)
  const newMatrix = _.cloneDeep([...matrix, ...penaltyMatrix]);
  // Return matrix without N start lines (matrix has 20 lines again)
  return _.slice(newMatrix, rowsNumber, newMatrix.length);
};

/*
** socket.emit eveins:
*/

/* SOCKETS.CHAT_MESSAGE */
const socketEmitNewUserMessage = ({ message, socket, username, roomName }: {
  message: string,
  socket?: SocketIOClient.Socket,
  username?: string, roomName?: string,
}): void => {
  if (!socket) return;
  socket.emit(SOCKETS.CHAT_MESSAGE, { username, message, roomName });
};

/* SOCKETS.PENALTY_ROWS */
const socketEmitPenaltyRows = ({ rowsNumber, username, roomName, socket }: {
  rowsNumber: number,
  username?: string,
  roomName?: string,
  socket?: SocketIOClient.Socket,
}): void => {
  if (!socket) return;
  console.log('PENALTY_ROWS emit, rowsNumber:', rowsNumber);
  socket.emit(SOCKETS.PENALTY_ROWS, { username, roomName, rowsNumber });
};

/* SOCKETS.UPDATE_SCORE */
const socketEmitUpdatePlayerScore = ({setCurrentPlayer, socket, isSoloMode }: {
  setCurrentPlayer: Dispatch<SetStateAction<PlayerType | undefined>>,
  isSoloMode: boolean,
  socket?: SocketIOClient.Socket,
}): void => {
  if (!socket) return;
  setCurrentPlayer((prevCurrentPlayer) => {
    if (!prevCurrentPlayer) return;
    socket.emit(SOCKETS.UPDATE_SCORE, { username: prevCurrentPlayer.username, roomName: prevCurrentPlayer.room, score: prevCurrentPlayer.score, isSoloMode });
    return prevCurrentPlayer;
  });
};

/* SOCKETS.GAMEOVER */
const socketEmitGameover = ({ isSoloMode, setCurrentPlayer, userContext, socket }: {
  isSoloMode: boolean,
  setCurrentPlayer: Dispatch<SetStateAction<PlayerType | undefined>>,
  userContext: UserContextType,
  socket?: SocketIOClient.Socket,
}): void => {
  if (isSoloMode) {
    return socketEmitUpdatePlayerScore({ setCurrentPlayer, isSoloMode, socket });
  } else {
    if (!socket) return;
    socket.emit(SOCKETS.GAMEOVER, { username: userContext.username, roomName: userContext.room });
  }
};

/* SOCKETS.UPDATE_SPECTRUM */
const socketEmitUpdateSpectrum = ({ spectrum, userContext, socket }: {
  spectrum: Matrix,
  userContext: UserContextType,
  socket?: SocketIOClient.Socket,
}): void => {
  if (!socket) return;
  socket.emit(SOCKETS.UPDATE_SPECTRUM, { username: userContext.username, roomName: userContext.room, spectrum });
};

/* SOCKETS.MORE_TETRIS_TILES */
const socketEmitMoreTetrisTiles = (userContext: UserContextType, socket?: SocketIOClient.Socket): void => {
  if (!socket) return;
  socket.emit(SOCKETS.MORE_TETRIS_TILES, { username: userContext.username, roomName: userContext.room });
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
** socket.on events:
*/

/* SOCKETS.CHAT_MESSAGE */
const socketReceiveChatMessage = (message: Message): void => {
  addResponseMessage(message.username + ': ' + message.text, message.username);
};

/* SOCKETS.FETCH_CURRENT_PLAYER */
const socketReceiveCurrentPlayer = ({player, setCurrentPlayer}: {
  player?: PlayerType,
  setCurrentPlayer: Dispatch<SetStateAction<PlayerType | undefined>>,
}): void => {
  setCurrentPlayer(player);
  console.log('FETCH_CURRENT_PLAYER', player);
};

/* SOCKETS.UPDATE_ROOM_PLAYERS */
const socketReceiveUpdateRoomPlayers = ({ setRoomPlayers, setRoomLeader, setCurrentPlayer, data }: {
    setRoomPlayers: Dispatch<SetStateAction<PlayerType[] | []>>,
    setRoomLeader: Dispatch<SetStateAction<PlayerType | undefined>>,
    setCurrentPlayer: Dispatch<SetStateAction<PlayerType | undefined>>,
    data: { room: string, players: PlayerType[] }
  }): void => {
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

/* SOCKETS.START_GAME */
const socketReceiveStartGame = ({ setTileStack, setGameStarted, setIsPause, tileStack }: {
  setTileStack: Dispatch<SetStateAction<TetriminosType[] | ['O']>>,
  setGameStarted: Dispatch<SetStateAction<boolean>>, 
  setIsPause: Dispatch<SetStateAction<boolean>>,
  tileStack: TetriminosType[],
}): void => {
  // TODO: assign tile stack here
  console.log('START_GAME', tileStack);
  setTileStack(tileStack);
  setGameStarted(true);
  setIsPause(false);
};

/* SOCKETS.PAUSE_GAME */
const socketReceivePauseGame = (setIsPause: Dispatch<SetStateAction<boolean>>): void => {
  setIsPause(prevState => !prevState);
};

/* SOCKETS.PENALTY_ROWS */
const socketReceivePenaltyRows = ({ setMatrix, rowsNumber }:
  { setMatrix: Dispatch<SetStateAction<Matrix>>, rowsNumber: number }): void => {
  setMatrix((prevMatrix) => {
    const newMatrix = addPenaltyRows(prevMatrix, rowsNumber);
    console.log('PENALTY_ROWS receive. rowsNumber, newMatrix:', rowsNumber, newMatrix);
    return newMatrix;
  });
};

/* SOCKETS.REDIRECT_TO_RANKING */
const socketReceiveRedirectToRanking = ({ username, room, navigation }: {
  username: string | undefined,
  room: string | undefined,
  navigation: StackNavigationProp<RootStackParamList, 'Playground'>,
}): void => {
  navigation.replace('Ranking', { username, room });
};

/* SOCKETS.GAMEOVER */
const socketReceiveGameover = ({ setCurrentPlayer, setIsPause, setMatrix, setGameover, isSoloMode, socket, data }: {
  setCurrentPlayer: Dispatch<SetStateAction<PlayerType | undefined>>,
  setIsPause: Dispatch<SetStateAction<boolean>>,
  setMatrix: Dispatch<SetStateAction<Matrix>>,
  setGameover: Dispatch<SetStateAction<boolean>>,
  isSoloMode: boolean,
  socket?: SocketIOClient.Socket,
  data: { players: PlayerType[], endGame: boolean },
}): void => {
  if (!socket) return;
  const roomWinner = _.find(data.players, (player) => player.isWinner);

  setCurrentPlayer((prevCurrentPlayer) => {
    if (prevCurrentPlayer && roomWinner && roomWinner.username === prevCurrentPlayer.username) {
      const playerWithUpdatedScore = { ...prevCurrentPlayer, score: prevCurrentPlayer.score + SCORING.LAST_PLAYER };
      return playerWithUpdatedScore;
    }
    return prevCurrentPlayer;
  });

  if (data.endGame) {
    socketEmitUpdatePlayerScore({ setCurrentPlayer, isSoloMode, socket });
    setIsPause(true);
    setMatrix(blankMatrix);
    setGameover(true);
  }
};

/* SOCKET.UPDATE_SPECTRUM */
const socketReceiveUpdateSpectrum = (roomPlayers: PlayerType[], setRoomPlayers: Dispatch<SetStateAction<PlayerType[] | []>>): void => {
  console.log('SOCKET.UPDATE_SPECTRUM, roomPlayers', roomPlayers);
  setRoomPlayers(roomPlayers);
};

/* SOCKETS.MORE_TETRIS_TILES */
const socketReceiveMoreTetrisTiles = (tileStack: TetriminosType[], setTileStack: Dispatch<SetStateAction<TetriminosType[] | ['O']>>): void => {
  setTileStack((prevTileStack) => [...prevTileStack, ...tileStack]);
};

/* SOCKETS.SPEED_MODE */
const socketReceiveSpeedMode = (setSpeedMode: Dispatch<SetStateAction<boolean>>): void => {
  setSpeedMode((prevSpeedMode) => !prevSpeedMode);
};

export {
  socketReceiveChatMessage,
  socketEmitNewUserMessage,
  socketReceiveCurrentPlayer,
  socketReceiveUpdateRoomPlayers,
  socketReceiveStartGame,
  socketReceivePauseGame,
  socketEmitPenaltyRows,
  socketReceivePenaltyRows,
  socketEmitUpdatePlayerScore,
  socketReceiveRedirectToRanking,
  socketEmitGameover,
  socketReceiveGameover,
  socketEmitUpdateSpectrum,
  socketReceiveUpdateSpectrum,
  socketEmitMoreTetrisTiles,
  socketReceiveMoreTetrisTiles,
  socketReceiveSpeedMode,
};
