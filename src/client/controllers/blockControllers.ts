import _ from 'lodash';

import { blockShape, initialPos, blankLine, cellState } from '/client/constants/tetriminos.ts';

const blockCreate = ({pos, shape, type, timeStamp}: BlockOption): BlockType => {
  return {
    pos: pos ?? initialPos[type],
    shape: shape ?? blockShape[type],
    type: type,
    timeStamp: timeStamp ?? Date.now(),
  };
};

const blockRotate = (block: BlockType): BlockType => {
  const shape = block.shape;
  const result: number[][] = shape[0].map((val, index) => shape.map(row => row[index]).reverse());

  return {
    pos: block.pos,
    shape: result,
    type: block.type,
    timeStamp: block.timeStamp,
  };
};

const blockFall = (block: BlockType, n = 1): BlockType => {
  return {
    pos: [block.pos[0] + n, block.pos[1]],
    shape: block.shape,
    type: block.type,
    timeStamp: block.timeStamp,
  };
};

const blockRight = (block: BlockType): BlockType => {
  return {
    pos: [block.pos[0], block.pos[1] + 1],
    shape: block.shape,
    type: block.type,
    timeStamp: block.timeStamp,
  };
};

const blockLeft = (block: BlockType): BlockType => {
  return {
    pos: [block.pos[0], block.pos[1] - 1],
    shape: block.shape,
    type: block.type,
    timeStamp: block.timeStamp,
  };
};

const blockDrop = (block: BlockType, matrix: Matrix): BlockType => {
  let newState = blockCreate({ type: block.type, pos: block.pos, shape: block.shape });

  while (isBlockValid(blockFall(newState), matrix)) { 
    newState = blockFall(newState);
  }
  return newState;  
};

const blockGetBlockPos = (block: BlockType): number[][] => {
  const positions: number[][] = [];
  _.map(block.shape, (row, rowIndex) =>
    _.map(row, (val, colIndex) => { 
      if (val) positions.push([rowIndex + block.pos[0], colIndex + block.pos[1]]);
    }));
  return positions;
};

const blockGetCorner = (block: BlockType): { left: number, top: number, right: number, bottom: number } => { 
  const rows = _.map(blockGetBlockPos(block), ([row]) => row);
  const cols = _.map(blockGetBlockPos(block), ([, col]) => col);
  return {
    left: _.min(cols) ?? 0,
    top: _.min(rows) ?? 0,
    right: _.max(cols) ?? 0,
    bottom: _.max(rows) ?? 0,
  };
};

const isBlock = (block: BlockType, pos: number[]): boolean => { 
  return _.find(blockGetBlockPos(block), (shapePos) => _.isEqual(shapePos, pos)) !== undefined;
};

const isBlockValid = (block: BlockType, matrix: Matrix): boolean => { 
  const hitBlock = _.find(blockGetBlockPos(block), ([row, col]) => matrix?.[row]?.[col] === cellState.BLOCKED || matrix?.[row]?.[col] === cellState.OCCUPIED);
  const { left, right, bottom } = blockGetCorner(block);
  return bottom < 20
    && left >= 0
    && right < 10
    && !hitBlock;
};

const printBlock = (block: BlockType, matrix: Matrix): Matrix => { 
  const newMatrix = _.cloneDeep(matrix);
  _.map(blockGetBlockPos(block), (pos) => {
    if (pos[0] >= 0 && pos[0] < _.size(newMatrix)
      && pos[1] >= 0 && pos[1] < _.size(newMatrix[0])) {
      newMatrix[pos[0]][pos[1]] = cellState.OCCUPIED;
    }
  });
  return newMatrix;
};

const destroyBlock = (matrix: Matrix): { newMatrix: Matrix, deletedRows: number} => {
  let bottomMatrix: Matrix = [];
  let topMatrix: Matrix = [];
  _.map(matrix, (row) => {
    // Row sum = 10 when row is complete (cellState.OCCUPIED);
    // Row sum > 10 (row sum = 20) when there is a penalty row (because penalty row consists of cellState.BLOCKED = 2)
    if (_.sum(row) < 10 || _.sum(row) > 10) {
      bottomMatrix = _.cloneDeep([...bottomMatrix, row]);
      // TODO: We can send SOCKETS.SPECTER_UPDATE here when bottomMatrix.length === 20
    } else {
      topMatrix = _.cloneDeep([...topMatrix, blankLine]);
    }
  });
  console.log('Destroy', _.cloneDeep([...topMatrix, ...bottomMatrix])); // TODO: rm
  return ({ newMatrix: _.cloneDeep([...topMatrix, ...bottomMatrix]), deletedRows: topMatrix.length });
};

export { 
  blockCreate,
  blockRotate,
  blockFall,
  blockRight,
  blockLeft,
  blockDrop,
  blockGetBlockPos,
  blockGetCorner,
  isBlock,
  isBlockValid,
  printBlock,
  destroyBlock,
};
