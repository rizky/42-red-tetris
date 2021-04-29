import { TouchableOpacity, View, Text, ViewStyle } from 'react-native';
import React from 'react';

const RoundButton = ({
  size, color, label, style, onPress, disabled, text,
}: {
  size: number, color: string, label?: string,
  style?: ViewStyle, onPress?: () => void, disabled?: boolean, text?: string,
}): JSX.Element => {
  const button = React.useRef<TouchableOpacity>(null);

  return (
    <View style={[{ alignItems: 'center' }, style]}>
      <TouchableOpacity
        ref={button}
        disabled={disabled}
        onPress={() => onPress?.()}
        style={{
          backgroundColor: color,
          borderRadius: size / 2,
          height: size,
          width: size,
          shadowColor: 'rgba(0,0,0, .4)',
          shadowOffset: { height: 1, width: 1 },
          shadowOpacity: 20,
          shadowRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
        }} >
        {text && <Text style={{ fontSize: 25 }}>{text}</Text>}
      </TouchableOpacity>
      {label && <Text style={{ marginTop: 10 }}>{label}</Text>}
    </View>
  );
};

export default RoundButton;
