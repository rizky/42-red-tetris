import _ from 'lodash';

import { cellState } from '/client/constants/tetriminos';

const formatChatTitle = (leader: string): string => {
  return `Leader: ${leader}`;
};

const formatChatSubtitle = (players: string[]): string => {
  if (players.length === 0) return 'No players';
  return `Players: ${players.join(', ')}`;
};

const roomPlayersNames = (players?: PlayerType[]): string[] => {
  if (!players || players.length === 0) return [];
  const namesArray = players.map((player) => player.username);
  return namesArray;
};

const convertMatrixToSpectrum = (matrix: Matrix): Matrix => {
  const result = _.cloneDeep(matrix);
  for (let j = 0; j < matrix[0].length; j++) {
    let flag = false;
    for (let i = 0; i < matrix.length; i++) {
      if (matrix[i][j] === cellState.OCCUPIED)
        flag = true;
      if (flag)
        result[i][j] = cellState.OCCUPIED;
    }
  }
  return result;
};

const filteredOpponents = (roomPlayers: PlayerType[], currentPlayerUsername: string): PlayerType[] => {
  return _.filter(roomPlayers, (player) => player.username !== currentPlayerUsername);
};

export { formatChatSubtitle, formatChatTitle, roomPlayersNames, convertMatrixToSpectrum, filteredOpponents };
