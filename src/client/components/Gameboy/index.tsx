import { StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import Keypad from '/client/components/Keypad';

import { useWindowDimensions } from '/client/hooks/useWindowDimensions';
import UserContext from '/client/context/UserContext';

export const previewText = (isMultiplayerMode: boolean, otherPlayersNumber: number, isLeader?: boolean):React.ReactChild  => {
  const secondLineText = (otherPlayersNumber: number, isLeader?: boolean) => {
    if (otherPlayersNumber <= 0) return 'Wait for other players';
    if (otherPlayersNumber > 0 && isLeader) return 'Press Play(P) to start';
    if (otherPlayersNumber > 0 && !isLeader) return 'Wait for leader to start the game';
  };
  if (isMultiplayerMode) {
    return (
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.gameMode}>You are in multiplayer mode</Text>
        <Text style={styles.gameMode}>{otherPlayersNumber} ohter players in your room</Text>
        <Text>{secondLineText(otherPlayersNumber, isLeader)}</Text>
      </View>
    );
  } else {
    return (
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.gameMode}>You are in solo mode</Text>
        <Text>Press Play(P) to start</Text>
      </View>
    );
  }
};

type Props = {
  children: React.ReactChild,
  isPause?: boolean,
  roomPlayers?: string[],
  isLeader?: boolean,
}

export default function Gameboy(props: Props): JSX.Element {
  const {children, isPause, roomPlayers, isLeader} = props;
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

  return (
    <View style={styles.container}>
      <View style={[styles.gameboy, { transform: [{ scale }] }]}>
        <Text style={styles.title}>R E D ■ T E T R I S</Text>
        <View style={styles.display}>
          {children}
          {isPause ?
            <View style={[styles.display, { position: 'absolute', opacity: 0.8 }]} >
              {previewText(isMultiplayerMode, opponentsNumber, isLeader)}
            </View>
            : null}
        </View>
        <Keypad isPause={isPause}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#990011ff',
    borderRadius: 20,
    paddingBottom: 50,
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
});
