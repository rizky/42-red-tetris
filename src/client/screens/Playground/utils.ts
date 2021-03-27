import _ from 'lodash';

import { cellState } from '/client/constants/tetriminos.ts';

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

// const matrixSpectrum = (matrix: Matrix): Matrix => {
//   const result = [];
//   console.log(matrix.length, matrix[0].length);
//   for (let i = 0; i < matrix[0].length; i++) {
//     result.push([]);
//     // result[i] = new Array(matrix[0].length);
//     console.log('new Array', result);
//     let flag = false;
//     for (let j = 0; j < matrix.length; j++) {
//       // const test = matrix[i][0];
//       console.log(j, result);
//       if (matrix[i][j] === 1) {
//         flag = true;
//       }
//       if (flag)
//         // result[i].push(1);
//         result[i][j] = 1;
//       else
//         // result[i].push(matrix[i][j]);
//         result[i][j] = matrix[i][j];
//     }
//   }
//   return result;
// };

const rowFillWithOccupied = (row: number[]): number[] => {
  const index = _.indexOf(row, cellState.OCCUPIED);
  if (index === -1) return row;
  return(_.fill(row, cellState.OCCUPIED, index));
};

const transposeMatrix = (matrix: Matrix): Matrix => {
  const result = [];
  for (let i = 0; i < matrix[0].length; i++) {
    result.push([]);
    for (let j = 0; j < matrix.length; j++) {
      result[i].push(matrix[j][i]);
    }
  }
  return(result);
};

const fillSpectrum = (matrix: Matrix): Matrix => {
  const transposedMatrix = transposeMatrix(matrix);
  const transposedFilled = _.map(transposedMatrix, (array) => rowFillWithOccupied(array));
  return transposeMatrix(transposedFilled);
};

export { formatChatSubtitle, formatChatTitle, roomPlayersNames, rowFillWithOccupied, fillSpectrum };
