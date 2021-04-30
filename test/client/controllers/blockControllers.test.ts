import { 
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
} from '/client/controllers/blockControllers';
import { blockTypes, initialPos, blockShape, blankMatrix } from '/client/constants/tetriminos';

describe('blockCreate', () => {
  it('should return default block of BlockType with just nesessary params', () => {
    expect(blockCreate({ type: 'L' })).toEqual({
      pos: initialPos.L,
      shape: blockShape.L,
      type: blockTypes[1],
    });
  });
  it('should return block of BlockType', () => {
    expect(blockCreate({ type: 'L', pos: [0, 0] })).toEqual({
      pos: [0, 0],
      shape: blockShape.L,
      type: blockTypes[1],
    });
  });
});

describe('blockRotate', () => {
  it('should return rotated block of BlockType', () => {
    const blockL = {
      pos: [2, 4],
      shape: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]],
      type: blockTypes[1],
    };
    const blockO = {
      pos: [2, 4],
      shape: [
        [1, 1],
        [1, 1]],
      type: blockTypes[5],
    };
  
    expect(blockRotate(blockL)).toEqual({
      pos: [2, 4],
      shape: [  
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]],
      type: 'L',
    });
    expect(blockRotate(blockO)).toEqual({
      pos: [2, 4],
      shape: [
        [1, 1],
        [1, 1]],
      type: 'O',
    });
  });
});

describe('blockFall', () => {
  it('should return block of BlockType after move down', () => {
    const blockL = {
      pos: [2, 4],
      shape: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]],
      type: blockTypes[1],
    };
    expect(blockFall(blockL)).toEqual({
      pos: [3, 4],
      shape: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]],
      type: 'L',
    });
  });
});

describe('blockRight', () => {
  it('should return block of BlockType after move to right', () => {
    const blockL = {
      pos: [2, 4],
      shape: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]],
      type: blockTypes[1],
    };
    expect(blockRight(blockL)).toEqual({
      pos: [2, 5],
      shape: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]],
      type: 'L',
    });
  });
});

describe('blockLeft', () => {
  it('should return block of BlockType after move to left', () => {
    const blockL = {
      pos: [2, 4],
      shape: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]],
      type: blockTypes[1],
    };
    expect(blockLeft(blockL)).toEqual({
      pos: [2, 3],
      shape: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]],
      type: 'L',
    });
  });
});

describe('blockDrop', () => {
  it('should return block of BlockType after drop to the bottom', () => {
    const blockL = {
      pos: [2, 4],
      shape: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]],
      type: blockTypes[1],
    };
    expect(blockDrop(blockL, blankMatrix)).toEqual({
      pos: [18, 4],
      shape: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]],
      type: 'L',
    });
  });
});

describe('blockGetBlockPos', () => {
  it('should return coordinates of block cells with value 1', () => {
    const blockL = {
      pos: [2, 4],
      shape: [
        [0, 0, 1], // [0; 2] + [2; 4] = [2; 6]
        [1, 1, 1],
        [0, 0, 0]],
      type: blockTypes[1],
    };
    expect(blockGetBlockPos(blockL)).toEqual([
      [2, 6],
      [3, 4],
      [3, 5],
      [3, 6]]);
  });
});

describe('blockGetCorner', () => {
  it('should return block corner', () => {
    const blockL = {
      pos: [2, 4],
      shape: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]],
      type: blockTypes[1],
    };
    expect(blockGetCorner(blockL)).toEqual({
      bottom: 3,
      left: 4,
      right: 6,
      top: 2,
    });
  });
});

describe('isBlock', () => {
  const blockL = {
    pos: [2, 4],
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]],
    type: blockTypes[1],
  };
  it('should return true', () => {
    expect(isBlock(blockL, [2, 6])).toEqual(true);
  });
  it('should return false', () => {
    expect(isBlock(blockL, [2, 4])).toEqual(false);
  });
});

describe('isBlockValid', () => {
  const blockL = {
    pos: [2, 4],
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]],
    type: blockTypes[1],
  };

  const blockHitMatrix = {
    pos: [19, 4],
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]],
    type: blockTypes[1],
  };
  it('should return true', () => {
    expect(isBlockValid(blockL, blankMatrix)).toEqual(true);
  });
  it('should return false', () => {
    expect(isBlockValid(blockHitMatrix, blankMatrix)).toEqual(false);
  });
});

describe('printBlock', () => {
  it('should return Matrix with block on it', () => {
    const blockL = {
      pos: [2, 4],
      shape: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]],
      type: blockTypes[1],
    };

    expect(printBlock(blockL, blankMatrix)).toEqual([
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);
  });

  it('should return Matrix with block outside of it', () => {
    const blockL = {
      pos: [-2, 4],
      shape: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]],
      type: blockTypes[1],
    };

    expect(printBlock(blockL, blankMatrix)).toEqual(blankMatrix);
  });
});

describe('destroyBlock', () => {
  it('should new Matrix after block is destroyed', () => {
    const initialMatrix = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    ];
    expect(destroyBlock(initialMatrix)).toEqual({
      newMatrix: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      ],
      deletedRows: 1,
    });
  });
});
