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
  I: [-2, 3],
  L: [-2, 4],
  J: [-2, 4],
  Z: [-2, 4],
  S: [-2, 4],
  O: [-2, 4],
  T: [-2, 4],
};

export const blockTypes: TetriminosType[] = ['I', 'L', 'J', 'Z', 'S', 'O', 'T'];

// export const speeds = [800, 650, 500, 370, 250, 160];

// export const delays = [50, 60, 70, 80, 90, 100];

// export enum cellState {
//   FREE,
//   OCCUPIED,
//   BLOCKED,
// }

// export const fillLine = _.fill(Array(10), cellState.OCCUPIED); // never used

// export const blankLine = _.fill(Array(10), cellState.FREE);

// export const penaltyLine = _.fill(Array(10), cellState.BLOCKED);

// export const blankMatrix: Matrix = _.map(Array(20), () => _.fill(Array(10), cellState.FREE));

// export const blockMatrix: Matrix = _.map(Array(2), () => _.fill(Array(4), cellState.FREE));
