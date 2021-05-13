import _ from 'lodash';

export const SOCKETS = {
  /* ---- User ---- */
  CREATE_USER: 'create user',
  FETCH_CURRENT_PLAYER: 'fetch current player',

  /* ---- Room ---- */
  CHOOSE_ROOM: 'create or join room',
  ENTER_ROOM: 'enter room',
  UPDATE_ROOM_PLAYERS: 'update room players',
  PLAYER_LEFT: 'player left',
  START_GAME: 'start game',
  PAUSE_GAME: 'pause game',
  PENALTY_ROWS: 'penalty rows',
  UPDATE_SPECTRUM: 'update spectrum',
  MORE_TETRIS_TILES: 'load more tetris tiles',
  SPEED_MODE: 'increase tetris falling speed',
  RESTART_GAME: 'restart game',

  /* ---- Game ---- */
  FETCH_WAITING_ROOMS: 'fetch waiting rooms',
  UPDATE_WAITING_ROOMS: 'update waiting rooms',
  GAMEOVER: 'gameover',
  FETCH_ROOM_RANKING: 'fetch room ranking',
  UPDATE_SCORE: 'update score',
  REDIRECT_TO_RANKING: 'redirect to ranking',
  
  /* ---- Chat ---- */
  CHAT_MESSAGE: 'chat message',
};

export const SCORING = {
  ROW_DESTROYED: 10,
  PIECE_PLACED: 4,
  LAST_PLAYER: 200,
};

export const maxPlayersLimit = 4;

/* ---- Tetriminos ---- */

export enum cellState {
  FREE,
  OCCUPIED,
  BLOCKED,
}

export const blankLine = _.fill(Array(10), cellState.FREE);

export const penaltyLine = _.fill(Array(10), cellState.BLOCKED);

export const blankMatrix: Matrix = _.map(Array(20), () => _.fill(Array(10), cellState.FREE));

export const blockMatrix: Matrix = _.map(Array(2), () => _.fill(Array(4), cellState.FREE));

