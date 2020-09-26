
type Matrix = number[][];

type TetriminosType = 'I' | 'L' | 'J' | 'Z' | 'S' | 'O' | 'T';

type BlockOption = {
  pos?: number[];
  shape?: number[][];
  type: TetriminosType;
  timeStamp?: number;
};
