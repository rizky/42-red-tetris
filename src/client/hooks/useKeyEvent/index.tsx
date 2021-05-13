import { Dispatch, SetStateAction } from 'react';
import useKey from 'use-key-hook';
import { isWidgetOpened } from '/client/components/Chat';

import { keyboard } from '/client/constants/keyboard';
import {
  blockRotate,
  blockFall,
  blockRight,
  blockLeft,
  blockDrop,
  isBlockValid,
  printBlock,
} from '/client/controllers/blockControllers';

export const useKeyEvent = ({ setIsPause, setMatrix, setBlock }
  : {
    setIsPause: Dispatch<SetStateAction<boolean>>,
    setMatrix: Dispatch<SetStateAction<Matrix>>,
    setBlock: Dispatch<SetStateAction<BlockType>>,
  }): void => {
  useKey((_key: number, { keyCode }: { keyCode: number }) => {
    // When Chat widget is opened, key press should not affect movement on Matrix Playground
    if (isWidgetOpened()) return;
    setIsPause((prevIsPause) => {
      setMatrix((prevMatrix) => {
        if (!prevIsPause) {
          /* Space key */
          if (keyCode === keyboard.space) {
            setBlock((currentBlock) => {
              const nextBlock = blockDrop(currentBlock, prevMatrix);
              setMatrix(printBlock(nextBlock, prevMatrix));
              return nextBlock;
            });
          }
          /* Arrow up key */
          else if (keyCode === keyboard.rotate) {
            setBlock((currentBlock) => isBlockValid(blockRotate(currentBlock), prevMatrix) ? blockRotate(currentBlock) : currentBlock);
          }
          /* Arrow left key */
          else if (keyCode === keyboard.left) {
            setBlock((currentBlock) => isBlockValid(blockLeft(currentBlock), prevMatrix) ? blockLeft(currentBlock) : currentBlock);
          }
          /* Arrow right key */
          else if (keyCode === keyboard.right) {
            setBlock((currentBlock) => isBlockValid(blockRight(currentBlock), prevMatrix) ? blockRight(currentBlock) : currentBlock);
          }
          /* Arrow down key */
          else if (keyCode === keyboard.down) {
            setBlock((currentBlock) => {
              if (isBlockValid(blockFall(currentBlock), prevMatrix)) return blockFall(currentBlock);
              else {
                setMatrix(printBlock(currentBlock, prevMatrix));
                return currentBlock;
              }
            });
          }
        }
        return prevMatrix;
      });
      return prevIsPause;
    });
  });
};
