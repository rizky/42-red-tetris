import { TouchableOpacity, View, Text, ViewStyle } from 'react-native';
import * as React from 'react';

import { keyboard } from '/client/constants/keyboard';

const RoundButton = ({
  size, color, label, style, onPress, disabled,
}: {
  size: number, color: string, label?: string,
  style?: ViewStyle, onPress?: () => void, disabled?: boolean,
}): JSX.Element => {
  return (
    <View style={[{ alignItems: 'center', margin: 10 }, style]}>
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={{
          backgroundColor: color,
          borderRadius: size / 2,
          height: size,
          width: size,
          shadowColor: 'rgba(0,0,0, .4)',
          shadowOffset: { height: 1, width: 1 },
          shadowOpacity: 20,
          shadowRadius: 5,
        }} />
      <Text style={{ marginTop: 10 }}>{label}</Text>
    </View>
  );
};

const Keypad = ({ isPause }: { isPause?: boolean }): JSX.Element => {
  const keyDown = (key: number) => {
    // @ts-ignore https://github.com/microsoft/TSJS-lib-generator/pull/892
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: key, which: key }));
  };
  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <RoundButton
              color="#2dc421" size={50} label="Pause/Play(P)"
              onPress={() => keyDown(keyboard.pause)}
            />
            <RoundButton
              color="#2dc421" size={50} label="Sound(S)"
              onPress={() => keyDown(keyboard.sound)}
            />
            <RoundButton
              color="#efcc19" size={50} label="Reset(R)"
              onPress={() => keyDown(keyboard.reset)}
            />
          </View>
          <View style={{ alignItems: 'center' }}>
            <RoundButton
              color="#5a65f1" size={160} label="Drop(Space)" style={{ marginTop: 20 }}
              disabled={isPause}
              onPress={() => keyDown(keyboard.space)}
            />
          </View>
        </View>
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <RoundButton
            color="#5a65f1" size={70} style={{ margin: 0 }}
            disabled={isPause}
            onPress={() => keyDown(keyboard.rotate)}
          />
          <View style={{ flexDirection: 'row' }}>
            <RoundButton
              color="#5a65f1" size={70} style={{ margin: 0, marginRight: 60 }}
              disabled={isPause}
              onPress={() => keyDown(keyboard.left)}
            />
            <RoundButton
              color="#5a65f1" size={70} style={{ margin: 0 }}
              disabled={isPause}
              onPress={() => keyDown(keyboard.right)}
            />
          </View>
          <RoundButton
            color="#5a65f1" size={70} style={{ margin: 0 }}
            disabled={isPause}
            onPress={() => keyDown(keyboard.down)}
          />
        </View>
      </View>
    </View>
  );
};

export default Keypad;
