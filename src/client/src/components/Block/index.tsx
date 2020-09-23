import { StyleSheet, View } from 'react-native';
import * as React from 'react';

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

const Block = ({ value }: { value: number }): JSX.Element => {
  return (
    <View style={[styles.outer, value ? { borderColor: 'black' } : undefined]}>
      <View style={[styles.inner, value ? { backgroundColor: 'black' } : undefined]} />
    </View>
  );
};

export default Block;
