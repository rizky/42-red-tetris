import { StyleSheet, View } from 'react-native';
import * as React from 'react';

import { cellState } from '/client/constants/tetriminos.ts';

const styles = StyleSheet.create({
  container: {
    marginRight: 2,
    marginBottom: 2,
  },
  outer: {
    alignItems: 'center',
    borderColor: '#879372',
    borderWidth: 1,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  inner: {
    height: 12,
    width: 12,
    backgroundColor: '#879372',
  },
});

const Block = ({ value }: { value: CellStateType }): JSX.Element => {
  return (
    <View style={[styles.outer, value === cellState.OCCUPIED ? { borderColor: 'black' } : (value === cellState.BLOCKED ? { borderColor: 'black'} : undefined)]}>
      <View style={[styles.inner, value === cellState.OCCUPIED ? { backgroundColor: 'black' } : (value === cellState.BLOCKED ? { backgroundColor: 'transparent'} : undefined)]} />
    </View>
  );
};

export default Block;
