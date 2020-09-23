import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Room({
  navigation,
}: StackScreenProps<RootStackParamList, 'Room'>): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{'Room'}</Text>
      <TouchableOpacity onPress={() => navigation.push('Playground')} style={styles.link}>
        <Text style={styles.linkText}>Go to Playground!</Text>
      </TouchableOpacity>
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
