import { StyleSheet, View } from 'react-native';
import * as React from 'react';

import { cellState } from '/config/constants';

const styles = StyleSheet.create({
  outer: {
    alignItems: 'center',
    borderColor: '#879372',
    borderWidth: 1,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  outerSpectrum: {
    alignItems: 'center',
    borderColor: '#879372',
    borderWidth: 1,
    height: 6,
    justifyContent: 'center',
    width: 6,
  },
  inner: {
    height: 12,
    width: 12,
    backgroundColor: '#879372',
  },
  innerSpectrum: {
    height: 2,
    width: 2,
    backgroundColor: '#879372',
  },
});

const Block = ({ value, isSpectrum }: { value: CellStateType | number, isSpectrum?: boolean }): JSX.Element => {
  return (
    isSpectrum
      ?
      <View style={[styles.outerSpectrum, value === cellState.OCCUPIED ? { borderColor: 'black' } : (value === cellState.BLOCKED ? { borderColor: 'black'} : undefined)]}>
        <View style={[styles.innerSpectrum, value === cellState.OCCUPIED ? { backgroundColor: 'black' } : (value === cellState.BLOCKED ? { backgroundColor: 'transparent'} : undefined)]} />
      </View>
      :
      <View style={[styles.outer, value === cellState.OCCUPIED ? { borderColor: 'black' } : (value === cellState.BLOCKED ? { borderColor: 'black'} : undefined)]}>
        <View style={[styles.inner, value === cellState.OCCUPIED ? { backgroundColor: 'black' } : (value === cellState.BLOCKED ? { backgroundColor: 'transparent'} : undefined)]} />
      </View>
  );
};

export default Block;
