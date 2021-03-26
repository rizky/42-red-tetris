import { Dispatch, SetStateAction } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useKeyEvent = ({ setIsPause, setMatrix, setBlock }
  : {
    setIsPause: Dispatch<SetStateAction<boolean>>,
    setMatrix: Dispatch<SetStateAction<Matrix>>,
    setBlock: Dispatch<SetStateAction<BlockType>>,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  }): void => {};
