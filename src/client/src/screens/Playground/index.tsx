import _ from 'lodash';
import { View } from 'react-native';
import * as React from 'react';
import useInterval from '@use-it/interval';
import useKey from 'use-key-hook';

import { blankMatrix } from '/constants/tetriminos';
import { blockType } from '/constants/tetriminos';
import { keyboard } from '/constants/keyboard';
import Block from '/models/block';
import Matrix from '/components/Matrix';
import Gameboy from '/components/Gameboy';

const printBlock = (matrix: Matrix, block: Block) => { 
  const { shape, xy } = block;
  shape.forEach((m, i) => (
    m.forEach((n, j) => {
      if (xy[0] + i >= 0 && xy[0] + i < 20 && xy[1] + j < 10) {
        matrix[xy[0] + i][xy[1] + j] = shape[i][j];
      }
    })
  ));
  return matrix;
};

export default function Playground(): JSX.Element {
  const [block, setBlock] = React.useState<Block>(new Block({
    type: _.sample<TetriminosType>(blockType) ?? 'T',
  }));
  useInterval(() => {
    setBlock((currentBlock) =>
      (currentBlock.xy[0] + currentBlock.shape.length < 20)
        ? currentBlock.fall()
        : new Block({
          type: _.sample<TetriminosType>(blockType) ?? 'T',
        }));
  }, 500);
  useKey((key: number) => {
    if (key === keyboard.rotate) setBlock((currentBlock) => currentBlock.rotate());
    if (key === keyboard.left) setBlock((currentBlock) => currentBlock.left());
    if (key === keyboard.right) setBlock((currentBlock) => currentBlock.right());
    if (key === keyboard.down) setBlock((currentBlock) => currentBlock.fall());
  });
  const newMatrix = printBlock(blankMatrix(), block);
  return (
    <Gameboy>
      <View style={{ flexDirection: 'row' }}>
        <Matrix matrix={newMatrix} />
        <View style={{ width: 150 }} />
      </View>
    </Gameboy>
  );
}
