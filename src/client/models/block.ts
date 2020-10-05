
import { blockShape, initialPos } from '/client/constants/tetriminos.ts';

class Block {
  pos: number[];
  shape: number[][];
  type: TetriminosType;
  timeStamp: number;

  constructor(option: BlockOption) {
    this.type = option.type;

    if (!option.timeStamp) {
      this.timeStamp = Date.now();
    } else {
      this.timeStamp = option.timeStamp;
    }
    if (!option.shape) {
      this.shape = blockShape[this.type];
    } else {
      this.shape = option.shape;
    }
    if (!option.pos) {
      this.pos = initialPos[this.type];
    } else this.pos = option.pos;
  }
  rotate(): Block {
    const shape = this.shape;
    const result: number[][] = shape[0].map((val, index) => shape.map(row => row[index]).reverse());
    return new Block({
      shape: result,
      type: this.type,
      pos: this.pos,
      timeStamp: this.timeStamp,
    });
  }
  fall(n = 1): Block {
    return new Block({
      shape: this.shape,
      type: this.type,
      pos: [this.pos[0] + n, this.pos[1]],
      timeStamp: Date.now(),
    });
  }
  right(): Block {
    return new Block({
      shape: this.shape,
      type: this.type,
      pos: [this.pos[0], this.pos[1] + 1],
      timeStamp: this.timeStamp,
    });
  }
  left(): Block {
    return new Block({
      shape: this.shape,
      type: this.type,
      pos: [this.pos[0], this.pos[1] - 1],
      timeStamp: this.timeStamp,
    });
  }
}

export default Block;
