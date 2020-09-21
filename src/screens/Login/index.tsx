import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Login({
  navigation,
}: StackScreenProps<RootStackParamList, 'Root'>): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{'Login'}</Text>
      <TouchableOpacity onPress={() => navigation.push('Room')} style={styles.link}>
        <Text style={styles.linkText}>Go to room!</Text>
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
