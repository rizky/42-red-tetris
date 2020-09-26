import _ from 'lodash';
import { Asset } from 'expo-asset';
import { ImageBackground, View, ViewStyle } from 'react-native';
import * as React from 'react';

export default function Digits({ style }: { style?: ViewStyle }): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const imageURI = Asset.fromModule(require('../../../assets/sprite.png')).uri;
  return (
    <View style={[{ flexDirection: 'row' }, style]} >
      {_.map(Array(6), (val, index: number) => <ImageBackground
        key={index}
        source={{ uri: imageURI }}
        style={{ width: 14, height: 24, overflow: 'hidden' }}
        imageStyle={{
          height: 186,
          left: -215,
          resizeMode: 'cover',
          top: -25,
          width: 400,
        }}
      />)}
    </View>
  );
}
