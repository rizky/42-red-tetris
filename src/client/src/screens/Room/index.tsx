import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import * as React from 'react';

import Gameboy from '/components/Gameboy';

export default function Room(): JSX.Element {
  const route = useRoute<RouteProp<RootStackParamList, 'Room'>>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Room'>>();
  const [room, setRoom] = React.useState<string | null>();
  const { params } = route;
  const { username } = params;
  return (
    <Gameboy>
      <Text style={styles.title}>{`Welcome ${username}!`}</Text>
      <TextInput
        value={room ?? ''}
        onChangeText={setRoom}
        style={{ borderWidth: 1, margin: 20, height: 30 }}
      />
      <TouchableOpacity
        onPress={() => room && navigation.push('Playground', { username, room })}
      >
        <Text style={styles.linkText}>Play!</Text>
      </TouchableOpacity>
    </Gameboy>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  linkText: {
    fontSize: 14,
    color: '#004580',
  },
});