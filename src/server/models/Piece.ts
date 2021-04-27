import { blockTypes } from '../../client/constants/tetriminos';

export class Piece {
  type: TetriminosType;
  
  constructor() {
    this.type = this.selectRandomPiece();
  }

  selectRandomPiece(): TetriminosType {
    return blockTypes[Math.floor(Math.random() * blockTypes.length)];
  }
}
