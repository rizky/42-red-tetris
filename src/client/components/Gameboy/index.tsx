import { StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';

import Keypad from '/client/components/Keypad';
import { useWindowDimensions } from '/client/hooks/useWindowDimensions';
import UserContext from '/client/context/UserContext';
import PreviewText from '/client/components/Gameboy/PreviewText';

type Props = {
  children: React.ReactChild,
  isPause?: boolean,
  roomPlayers?: string[],
  isLeader?: boolean,
  gameStarted?: boolean,
  gameover?: boolean,
  isSoloMode?: boolean,
}

export default function Gameboy(props: Props): JSX.Element {
  const {children, isPause, roomPlayers, isLeader, gameStarted, gameover, isSoloMode} = props;
  const {userContext} = useContext(UserContext);
  const opponentsNumber = !roomPlayers || roomPlayers.length === 0 ? 0 : roomPlayers.length - 1;
  const isMultiplayerMode = userContext.username && userContext.room ? true : false;
  const window = useWindowDimensions();
  const w = window.width;
  const h = window.height;
  const ratio = h / w;
  let scale;
  if (ratio < 1.5) {
    scale = h / 960;
  } else {
    scale = w / 560;
  }

  const isKeypadDisabled = gameover;

  return (
    <View style={styles.container}>
      <View style={[styles.gameboy, { transform: [{ scale }] }]}>
        <Text style={styles.title}>R E D ■ T E T R I S</Text>
        <View style={styles.display}>
          {children}
          {isPause ?
            <View style={[styles.display, { position: 'absolute', opacity: 0.8 }]} >
              <PreviewText isMultiplayerMode={isMultiplayerMode} opponentsNumber={opponentsNumber} isLeader={isLeader} gameover={gameover} />
            </View>
            : null}
        </View>
        <Keypad isPause={isPause} opponentsNumber={opponentsNumber} isLeader={isLeader} gameStarted={gameStarted} disabled={isKeypadDisabled} isSoloMode={isSoloMode}/>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f393e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    height: '100%',
  },
  display: {
    alignItems: 'center',
    backgroundColor: '#9ead86',
    borderBottomColor: '#fa6b6b',
    borderLeftColor: '#980f0f',
    borderRightColor: '#fa6b6b',
    borderTopColor: '#980f0f',
    borderWidth: 5,
    height: 500,
    justifyContent: 'center',
    padding: 10,
    width: 400,
  },
  gameboy: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#990011',
    borderRadius: 20,
    paddingBottom: 30,
    paddingHorizontal: 50,
  },
  title: {
    fontSize: 30,
    marginVertical: 15,
    textAlign: 'center',
  },
  gameMode: {
    marginBottom: 20,
    fontSize: 18,
  },
  gameover: {
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#990011',
    fontSize: 24,
  },
});
