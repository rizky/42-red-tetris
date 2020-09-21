import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function RoomScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{'Room'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
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
    color: '#2e78b7',
  },
});
