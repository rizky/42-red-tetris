import _ from 'lodash';
import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import useInterval from '@use-it/interval';
import useKey from 'use-key-hook';

import Matrix from '/components/Matrix';
import { blankMatrix } from '/constants/tetriminos';
import Block from '/models/block';
import { blockType } from '/constants/tetriminos';

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
    if (key === 38) setBlock((currentBlock) => currentBlock.rotate());
    if (key === 37) setBlock((currentBlock) => currentBlock.left());
    if (key === 39) setBlock((currentBlock) => currentBlock.right());
    if (key === 40) setBlock((currentBlock) => currentBlock.fall());
  });
  const newMatrix = printBlock(blankMatrix(), block);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{'Playground'}</Text>
      <Matrix matrix={newMatrix} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
