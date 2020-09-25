import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import Keypad from '/components/Keypad';

export default function Gameboy({ children }: { children: JSX.Element[] | JSX.Element }): JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.gameboy}>
        <Text style={styles.title}>R E D ■ T E T R I S</Text>
        <View style={styles.display}>
          {children}
        </View>
        <Keypad/>
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
