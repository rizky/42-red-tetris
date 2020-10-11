import { Dispatch, SetStateAction } from 'react';
import Block from '/client/models/block';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useKeyEvent = ({ setIsPause, setMatrix, setBlock }
  : {
    setIsPause: Dispatch<SetStateAction<boolean>>,
    setMatrix: Dispatch<SetStateAction<Matrix>>,
    setBlock: Dispatch<SetStateAction<Block>>,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  }): void => {};
