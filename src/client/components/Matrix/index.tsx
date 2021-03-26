import _ from 'lodash';
import { View, ViewStyle, StyleSheet } from 'react-native';
import * as React from 'react';

import BlockComponent from '/client/components/Block';
import Block from '/client/models/block';
import { cellState } from '/client/constants/tetriminos.ts';

const blockWidth = 22;

const Matrix = ({ block, matrix, style }: { block: Block, matrix: Matrix, style?: ViewStyle }): JSX.Element => {
  return (
    <View style={[styles.container, { height: _.size(matrix) * blockWidth }, style]}>
      {_.map(matrix, (row, rowIndex) =>
        <View key={rowIndex} style={{ flexDirection: 'row', width: _.size(row) * blockWidth, justifyContent: 'space-between' }}>
          {_.map(row, (value, colIndex) => <BlockComponent key={colIndex} value={block.isBlock([rowIndex, colIndex]) ? cellState.OCCUPIED : value} />)}
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
