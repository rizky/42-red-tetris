import { Dispatch, SetStateAction } from 'react';
import useKey from 'use-key-hook';
import _ from 'lodash';

import { blankMatrix } from '/client/constants/tetriminos';
import { blockTypes } from '/client/constants/tetriminos';
import { keyboard } from '/client/constants/keyboard';
import Block from '/client/models/block';

export const useKeyEvent = ({ setIsPause, setMatrix, setBlock, isLeader }
  : {
    setIsPause: Dispatch<SetStateAction<boolean>>,
    setMatrix: Dispatch<SetStateAction<Matrix>>,
    setBlock: Dispatch<SetStateAction<Block>>,
    isLeader?: boolean,
  }): void => {
  console.log('Leader 1:', isLeader); // ok
  useKey((_key: number, { keyCode }: { keyCode: number }) => {
    console.log('Leader 2:', isLeader); // TODO: prop is not visible here, how to pass it?
    if (keyCode === keyboard.pause) setIsPause((prevState) => !prevState);
    if (keyCode === keyboard.reset) {
      setBlock(new Block({ type: _.sample(blockTypes) ?? 'T' }));
      setMatrix(blankMatrix);
      setIsPause(true);
    }
    setIsPause((prevIsPause) => {
      setMatrix((prevMatrix) => {
        if (!prevIsPause) {
          if (keyCode === keyboard.rotate) {
            setBlock((currentBlock) => currentBlock.rotate().isValid(prevMatrix) ? currentBlock.rotate() : currentBlock);
          }
          if (keyCode === keyboard.left) {
            setBlock((currentBlock) => currentBlock.left().isValid(prevMatrix) ? currentBlock.left() : currentBlock);
          }
          if (keyCode === keyboard.right) {
            setBlock((currentBlock) => currentBlock.right().isValid(prevMatrix) ? currentBlock.right() : currentBlock);
          }
          if (keyCode === keyboard.down) {
            setBlock((currentBlock) => {
              if (currentBlock.fall().isValid(prevMatrix)) return currentBlock.fall();
              else {
                setMatrix(currentBlock.printBlock(prevMatrix));

                return currentBlock;
              }
            });
          }
          if (keyCode === keyboard.space) {
            setBlock((currentBlock) => {
              const nextBlock = currentBlock.drop(prevMatrix);
              setMatrix(nextBlock.printBlock(prevMatrix));
              return nextBlock;
            });
          }
        }
        return prevMatrix;
      });
      return prevIsPause;
    });
  });
};
