import _ from 'lodash';
import { View, ViewStyle, StyleSheet } from 'react-native';
import * as React from 'react';

import BlockComponent from '/client/components/Block';
import Block from '/client/models/block';

const Matrix = ({ block, matrix, style }: { block: Block, matrix: Matrix, style?: ViewStyle }): JSX.Element => {
  return (
    <View style={[styles.container, { height: _.size(matrix) * 22 }, style]}>
      {_.map(matrix, (row, rowIndex) =>
        <View key={rowIndex} style={{ flexDirection: 'row', width: _.size(row) * 22, justifyContent: 'space-between' }}>
          {_.map(row, (value, colIndex) =>
            (
              (block.pos[0] <= rowIndex) && (block.pos[0] + _.size(block.shape) > rowIndex) &&
              (block.pos[1] <= colIndex) && (block.pos[1] + _.size(block.shape[0])) > colIndex
            ) ?
              <BlockComponent key={colIndex} value={block.shape[rowIndex - block.pos[0]][colIndex - block.pos[1]] || value} />
              : <BlockComponent key={colIndex} value={value} />
          )}
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