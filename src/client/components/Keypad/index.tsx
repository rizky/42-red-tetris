import { TouchableOpacity, View, Text, ViewStyle } from 'react-native';
import React, { useContext, Dispatch, SetStateAction } from 'react';
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

type Props = {
  isPause?: boolean,
  setIsPause?: Dispatch<SetStateAction<boolean>>,
  opponentsNumber: number,
  isLeader?: boolean,
  gameStarted?: boolean,
  disabled?: boolean,
  isSoloMode?: boolean,
}

const Keypad = (props: Props): JSX.Element => {
  const { isPause, setIsPause, opponentsNumber, isLeader, gameStarted, disabled, isSoloMode } = props;
  const socket = useContext(SocketContext);
  const { userContext, setUserContext } = useContext(UserContext);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Playground'>>();
  const showStartButton = isLeader && !gameStarted;
  const showPauseButton = (isLeader && gameStarted);
  const isButtonDisabled = !isSoloMode && (disabled || opponentsNumber < 1);

  const socketEmitStartGame = () => {
    if (!socket) throw Error('No socket');
    socket.emit(SOCKETS.START_GAME, { username: userContext.username, roomName: userContext.room });
  };

  const socketEmitPlayPause = () => {
    if (isSoloMode) {
      if (setIsPause) setIsPause(prevState => !prevState);
    }
    if (!socket) throw Error('No socket');
    socket.emit(SOCKETS.PAUSE_GAME, { username: userContext.username, roomName: userContext.room });
  };

  const socketExitPage = () => {
    if (!socket) throw Error('No socket');
    setUserContext({username: undefined, room: undefined});
    if (setIsPause) setIsPause(true);
    socket.emit(SOCKETS.PLAYER_LEFT, userContext.username);
    navigation.navigate('Root');
  };

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
            color={isButtonDisabled ? '#c0c0c0' : '#2dc421'} size={50} label='Start' text='▶'
            disabled={isButtonDisabled}
            onPress={() => socketEmitStartGame()}
          />}
          {showPauseButton &&
            <RoundButton
              disabled={isButtonDisabled}
              color={isButtonDisabled ? '#c0c0c0' : '#efcc19'} size={50} label={isPause ? 'Play(P)' : 'Pause(P)'} text={isPause ? '▶' : '||' }
              onPress={() => socketEmitPlayPause()}
            />}
          <RoundButton
            disabled={isButtonDisabled}
            color={isButtonDisabled ? '#c0c0c0' : '#2dc421'} size={50} label="Sound(S)"
            onPress={() => keyDown(keyboard.sound)}
          />
          <RoundButton
            disabled={isButtonDisabled}
            color={isButtonDisabled ? '#c0c0c0' : '#efcc19'} size={50} label="Reset(R)"
            onPress={() => keyDown(keyboard.reset)}
          />
          <RoundButton
            color="white" size={50} style={{ margin: 0 }} label='Exit' text='╳'
            onPress={() => socketExitPage()}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
          <View style={{ marginRight: 20 }}>
            <RoundButton
              color={isButtonDisabled ? '#c0c0c0' : '#5a65f1'} size={160} label="Drop(Space)" style={{ marginTop: 20 }}
              disabled={isButtonDisabled || isPause}
              onPress={() => keyDown(keyboard.space)}
            />
          </View>
          <View style={{ marginLeft: 20 }}>
            <RoundButton
              color={isButtonDisabled ? '#c0c0c0' : '#5a65f1'} size={70} style={{ margin: 0 }}
              disabled={isButtonDisabled || isPause}
              onPress={() => keyDown(keyboard.rotate)}
            />
            <View style={{ flexDirection: 'row' }}>
              <RoundButton
                color={isButtonDisabled ? '#c0c0c0' : '#5a65f1'} size={70} style={{ margin: 0, marginRight: 60 }}
                disabled={isButtonDisabled || isPause}
                onPress={() => keyDown(keyboard.left)}
              />
              <RoundButton
                color={isButtonDisabled ? '#c0c0c0' : '#5a65f1'} size={70} style={{ margin: 0 }}
                disabled={isButtonDisabled || isPause}
                onPress={() => keyDown(keyboard.right)}
              />
            </View>
            <RoundButton
              color={isButtonDisabled ? '#c0c0c0' : '#5a65f1'} size={70} style={{ margin: 0 }}
              disabled={isButtonDisabled || isPause}
              onPress={() => keyDown(keyboard.down)}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Keypad;
