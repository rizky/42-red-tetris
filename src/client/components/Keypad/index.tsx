import { TouchableOpacity, View, Text, ViewStyle } from 'react-native';
import React, { useContext } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { keyboard } from '/client/constants/keyboard';
import { SOCKETS } from '/config/constants';
import SocketContext from '/client/context/SocketContext';
import UserContext from '/client/context/UserContext';

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
        onPress={() => { button?.current?.blur(); onPress?.();}}
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

const Keypad = ({ isPause, opponentsNumber, isLeader }: { isPause?: boolean, opponentsNumber: number, isLeader?: boolean }): JSX.Element => {
  const socket = useContext(SocketContext);
  const { userContext, setUserContext } = useContext(UserContext);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Playground'>>();
  const showStartButton = isLeader; // || isLeader === undefined;

  const keyDown = (key: number) => {
    // @ts-ignore https://github.com/microsoft/TSJS-lib-generator/pull/892
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: key, which: key }));
  };
  return (
    <View style={{ width: 400 }}>
      <View style={{ width: '100%' }}>
        <View style={{ flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between'}}>
          {showStartButton &&
          <RoundButton
            color="#2dc421" size={50} label='Start' text='▶'
            disabled={opponentsNumber < 1}
            onPress={() => {
              if (!socket) throw Error('No socket');
              socket.emit(SOCKETS.START_GAME, { username: userContext.username, roomName: userContext.room });
            }}
          />}
          <RoundButton
            color="#2dc421" size={50} label={isPause ? 'Play(P)' : 'Pause(P)'}
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
          <RoundButton
            color="white" size={50} style={{ margin: 0 }} label='Exit' text='╳'
            onPress={() => {
              if (!socket) throw Error('No socket');
              setUserContext({username: undefined, room: undefined});
              socket.emit(SOCKETS.PLAYER_LEFT, userContext.username);
              navigation.navigate('Root');
            }}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
          <View style={{ marginRight: 20 }}>
            <RoundButton
              color="#5a65f1" size={160} label="Drop(Space)" style={{ marginTop: 20 }}
              disabled={isPause}
              onPress={() => keyDown(keyboard.space)}
            />
          </View>
          <View style={{ marginLeft: 20 }}>
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
    </View>
  );
};

export default Keypad;
