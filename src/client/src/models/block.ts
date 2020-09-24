import _ from 'lodash';

import { blockShape, origin } from '/constants/tetriminos.ts';

class Block {
  xy: number[];
  shape: number[][];
  type: TetriminosType;
  rotateIndex: number;
  timeStamp: number;

  constructor(option: BlockOption) {
    this.type = option.type;
    this.xy = option.xy ?? [-1, 4];
  
    if (!option.rotateIndex) {
      this.rotateIndex = 0;
    } else {
      this.rotateIndex = option.rotateIndex;
    }

    if (!option.timeStamp) {
      this.timeStamp = Date.now();
    } else {
      this.timeStamp = option.timeStamp;
    }

    if (!option.shape) { // init
      this.shape = blockShape[option.type].map((e) => e);
    } else {
      this.shape = option.shape;
    }
    if (!option.xy) {
      switch (option.type) {
        case 'I': // I
          this.xy = [0, 3];
          break;
        case 'L': // L
          this.xy = [-1, 4];
          break;
        case 'J': // J
          this.xy = [-1, 4];
          break;
        case 'Z': // Z
          this.xy = [-1, 4];
          break;
        case 'S': // S
          this.xy = [-1, 4];
          break;
        case 'O': // O
          this.xy = [-1, 4];
          break;
        case 'T': // T
          this.xy = [-1, 4];
          break;
        default:
          break;
      }
    }
  }
  rotate(): Block {
    const shape = this.shape;
    const result: number[][] = shape[0].map((val, index) => shape.map(row => row[index]).reverse());
    const nextXy = [
      this.xy[0] + origin[this.type][this.rotateIndex][0],
      this.xy[1] + origin[this.type][this.rotateIndex][1],
    ];
    const nextRotateIndex = this.rotateIndex + 1 >= origin[this.type].length ?
      0 : this.rotateIndex + 1;
    return new Block({
      shape: result,
      type: this.type,
      xy: nextXy,
      rotateIndex: nextRotateIndex,
      timeStamp: this.timeStamp,
    });
  }
  fall(n = 1): Block {
    return new Block({
      shape: this.shape,
      type: this.type,
      xy: [this.xy[0] + n, this.xy[1]],
      rotateIndex: this.rotateIndex,
      timeStamp: Date.now(),
    });
  }
  right(): Block {
    return new Block({
      shape: this.shape,
      type: this.type,
      xy: [this.xy[0], this.xy[1] + 1],
      rotateIndex: this.rotateIndex,
      timeStamp: this.timeStamp,
    });
  }
  left(): Block {
    return new Block({
      shape: this.shape,
      type: this.type,
      xy: [this.xy[0], this.xy[1] - 1],
      rotateIndex: this.rotateIndex,
      timeStamp: this.timeStamp,
    });
  }
}

export default Block;
