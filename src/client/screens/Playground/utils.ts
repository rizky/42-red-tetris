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

const matrixSpectrum = (matrix: Matrix): Matrix => {
  // const result = [];
  const result = _.cloneDeep(matrix);
  for (let j = 0; j < matrix[0].length; j++) {
    // result.push([]);
    console.log('new Array', result);
    let flag = false;
    for (let i = 0; i < matrix.length; i++) {
      console.log(j, result);
      if (matrix[i][j] === cellState.OCCUPIED) {
        flag = true;
      }
      if (flag)
        // result[i].push(1);
        result[i][j] = cellState.OCCUPIED;
      // else
        // result[i].push(matrix[i][j]);
        // result[i][j] = matrix[i][j];
    }
  }
  return result;
};

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

export { formatChatSubtitle, formatChatTitle, roomPlayersNames, rowFillWithOccupied, fillSpectrum, matrixSpectrum };
