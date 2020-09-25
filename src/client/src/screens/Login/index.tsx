import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import Gameboy from '/components/Gameboy';

export default function Login({
  navigation,
}: StackScreenProps<RootStackParamList, 'Root'>): JSX.Element {
  return (
    <Gameboy>
      <Text style={styles.title}>{'Login'}</Text>
      <TouchableOpacity onPress={() => navigation.push('Room')} style={styles.link}>
        <Text style={styles.linkText}>Go to room!</Text>
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
