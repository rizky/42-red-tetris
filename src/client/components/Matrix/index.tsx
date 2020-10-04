import _ from 'lodash';
import { View, ViewStyle, StyleSheet } from 'react-native';
import * as React from 'react';

import Block from '/client/components/Block';

const Matrix = ({ matrix, style }: { matrix: Matrix, style?: ViewStyle }): JSX.Element => {
  return (
    <View style={[styles.container, { height: _.size(matrix) * 22 }, style]}>
      {_.map(matrix, (row, index) =>
        <View key={index} style={{ flexDirection: 'row', width: _.size(row) * 22, justifyContent: 'space-between' }}>
          {_.map(row, (value, index) => <Block key={index} value={value} />)}
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