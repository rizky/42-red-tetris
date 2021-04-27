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
  
  /* ---- Game ---- */
  FETCH_WAITING_ROOMS: 'fetch waiting rooms',
  UPDATE_WAITING_ROOMS: 'update waiting rooms',
  GAMEOVER: 'gameover',
  FETCH_ROOM_RANKING: 'fetch room ranking',
  UPDATE_SCORE: 'update score',
  REDIRECT_TO_RANKING: 'redirect to ranking',
  
  /* ---- Chat ---- */
  CHAT_MESSAGE: 'chat message',

  /* ---- Error ---- */
  FORBIDDEN: 'access forbidden',
};

export const SCORING = {
  ROW_DESTROYED: 10,
  PIECE_PLACED: 4,
  LAST_PLAYER: 200,
};
