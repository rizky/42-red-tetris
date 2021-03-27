import _ from 'lodash';
import { View, ViewStyle, StyleSheet } from 'react-native';
import * as React from 'react';

import BlockComponent from '/client/components/Block';
import { isBlock } from '/client/controllers/blockControllers';
import { cellState } from '/client/constants/tetriminos.ts';


const Matrix = ({ block, matrix, style, isSpectrum }: { block: BlockType, matrix: Matrix, style?: ViewStyle, isSpectrum?:boolean }): JSX.Element => {
  const blockWidth = isSpectrum ? 8 : 22;
  return (
    <View style={[styles.container, { height: _.size(matrix) * blockWidth }, style]}>
      {_.map(matrix, (row, rowIndex) =>
        <View key={rowIndex} style={{ flexDirection: 'row', width: _.size(row) * blockWidth, justifyContent: 'space-between' }}>
          {_.map(row, (value, colIndex) => <BlockComponent key={colIndex} isSpectrum={isSpectrum} value={isBlock(block, [rowIndex, colIndex]) ? cellState.OCCUPIED : value} />)}
        </View>)}
    </View>
  );
};

export default Matrix;

const styles = StyleSheet.create({
  container: {
    padding: 2, justifyContent: 'space-between', borderColor: 'black', borderWidth: 1, backgroundColor: '#9ead86',
  },
});
   