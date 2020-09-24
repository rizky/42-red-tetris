
type Matrix = number[][];

type TetriminosType = 'I' | 'L' | 'J' | 'Z' | 'S' | 'O' | 'T';

type BlockOption = {
  xy?: number[];
  shape?: number[][];
  type: TetriminosType;
  rotateIndex?: number;
  timeStamp?: number;
};
