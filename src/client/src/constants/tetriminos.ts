import _ from 'lodash';

export const blockShape = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

export const initialPos = {
  I: [0, 3],
  L: [-1, 4],
  J: [-1, 4],
  Z: [-1, 4],
  S: [-1, 4],
  O: [-1, 4],
  T: [-1, 4],
};

export const blockTypes: TetriminosType[] = ['I','L','J','Z','S','O', 'T'];

export const speeds = [800, 650, 500, 370, 250, 160];

export const delays = [50, 60, 70, 80, 90, 100];

export const fillLine = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

export const blankLine = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export const blankMatrix = (): Matrix => _.map(Array(20), () => _.map(Array(10), 0));

export const blockMatrix = (): Matrix => _.map(Array(2), () => _.map(Array(4), 0));
