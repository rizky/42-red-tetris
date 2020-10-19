import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import Keypad from '/client/components/Keypad';

import { useWindowDimensions } from '/client/hooks/useWindowDimensions';

export default function Gameboy({ children, isPause, player }: { children: React.ReactChild, isPause?: boolean, player?: PlayerType }): JSX.Element {
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
              {player?.isLeader
                ? <Text>Press Play(P) to start</Text>
                : <Text>Wait for leader to start the game</Text>
              }
            </View>
            : null}
        </View>
        <Keypad isPause={isPause} player={player}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009688',
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
    height: 470,
    justifyContent: 'center',
    padding: 10,
    width: 400,
  },
  gameboy: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#af0000',
    borderRadius: 20,
    paddingBottom: 50,
    paddingHorizontal: 50,
  },
  title: {
    fontSize: 30,
    marginVertical: 20,
    textAlign: 'center',
  },
});
