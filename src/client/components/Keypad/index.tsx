import { View } from 'react-native';
import React, { useContext, Dispatch, SetStateAction, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Sound from 'react-sound';

import { keyboard } from '/client/constants/keyboard';
import { SOCKETS } from '/config/constants';
import SocketContext from '/client/context/SocketContext';
import UserContext from '/client/context/UserContext';
import RoundButton from '/client/components/RoundButton';

type Props = {
  isPause?: boolean,
  setIsPause?: Dispatch<SetStateAction<boolean>>,
  opponentsNumber: number,
  isLeader?: boolean,
  gameStarted?: boolean,
  gameover?: boolean,
  isSoloMode?: boolean,
  speedMode?: boolean,
}

const Keypad = (props: Props): JSX.Element => {
  const { isPause, setIsPause, opponentsNumber, isLeader, gameStarted, gameover, isSoloMode, speedMode } = props;
  const socket = useContext(SocketContext);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const { userContext, setUserContext } = useContext(UserContext);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Playground'>>();
  const showStartButton = isLeader && !gameStarted;
  const showPauseButton = (isLeader && gameStarted);
  const isButtonDisabled = !isSoloMode && (gameover || opponentsNumber < 1);
  const showSpeedModeButton = speedMode !== undefined ? true : false; // Condition is true on Playground screen
  const showSoundButton = showSpeedModeButton;

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
    setMusicPlaying(false);
    socket.emit(SOCKETS.PLAYER_LEFT, userContext.username);
    navigation.replace('Root');
  };

  const socketEmitSpeedMode = () => {
    if (!socket) throw Error('No socket');
    socket.emit(SOCKETS.SPEED_MODE, { username: userContext.username, roomName: userContext.room });
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
              color={isButtonDisabled ? '#c0c0c0' : '#efcc19'} size={50} label={isPause ? 'Play' : 'Pause'} text={isPause ? '▶' : '||' }
              onPress={() => socketEmitPlayPause()}
            />}
          {showSpeedModeButton &&
            <RoundButton
              disabled={isButtonDisabled}
              color={isButtonDisabled ? '#c0c0c0' : 'white'} size={50} label="Super speed" text={speedMode ? 'on' : 'off'}
              onPress={() => socketEmitSpeedMode()}
            />}
          {showSoundButton &&
            <RoundButton
              color={'white'} size={50} label="Sound" text={musicPlaying ? '🎶' : '🤫' }
              onPress={() => setMusicPlaying(!musicPlaying)}
            />}
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
      <Sound
        url={'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3'}
        playStatus={musicPlaying ? 'PLAYING' : 'STOPPED'}
        loop={true}
        autoLoad={true}
      />
    </View>
  );
};

export default Keypad;
