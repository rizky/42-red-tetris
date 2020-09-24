import _ from 'lodash';
import { View } from 'react-native';
import * as React from 'react';

import Block from '/components/Block';

const Matrix = ({ matrix }: { matrix: Matrix }): JSX.Element => {
  return (
    <View style={{ height: _.size(matrix) * 22, padding: 2, justifyContent: 'space-between', borderColor: 'black', borderWidth: 1, backgroundColor: '#9ead86' }}>
      {_.map(matrix, (row, index) =>
        <View key={index} style={{ flexDirection: 'row', width: _.size(row) * 22, justifyContent: 'space-between' }}>
          {_.map(row, (value, index) => <Block key={index} value={value} />)}
        </View>)}
    </View>
  );
};

export default Matrix;
