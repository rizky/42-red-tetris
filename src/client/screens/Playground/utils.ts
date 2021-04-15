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

// const rowFillWithOccupied = (row: number[]): number[] => {
//   const index = _.indexOf(row, cellState.OCCUPIED);
//   if (index === -1) return row;
//   return(_.fill(row, cellState.OCCUPIED, index));
// };

// const transposeMatrix = (matrix: Matrix): Matrix => {
//   const result = [];
//   for (let i = 0; i < matrix[0].length; i++) {
//     result.push([]);
//     for (let j = 0; j < matrix.length; j++) {
//       result[i].push(matrix[j][i]);
//     }
//   }
//   return(result);
// };

// const fillSpectrum = (matrix: Matrix): Matrix => {
//   const transposedMatrix = transposeMatrix(matrix);
//   const transposedFilled = _.map(transposedMatrix, (array) => rowFillWithOccupied(array));
//   return transposeMatrix(transposedFilled);
// };

export { formatChatSubtitle, formatChatTitle, roomPlayersNames, convertMatrixToSpectrum };
