import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import Gameboy from '/components/Gameboy';

export default function Room({
  navigation,
}: StackScreenProps<RootStackParamList, 'Room'>): JSX.Element {
  return (
    <Gameboy>
      <Text style={styles.title}>{'Room'}</Text>
      <TouchableOpacity onPress={() => navigation.push('Playground')} style={styles.link}>
        <Text style={styles.linkText}>Go to Playground!</Text>
      </TouchableOpacity>
    </Gameboy>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#004580',
  },
});