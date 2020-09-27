import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';

import Gameboy from '/components/Gameboy';

export default function Login(): JSX.Element {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Root'>>();
  const [username, setUsername] = React.useState<string | null>();
  return (
    <Gameboy>
      <Text style={styles.title}>{'Set username'}</Text>
      <TextInput
        value={username ?? ''}
        onChangeText={setUsername}
        style={{ borderWidth: 1, margin: 20, height: 30 }}
      />
      <TouchableOpacity
        onPress={() => username && navigation.push('Room', { username })}
      >
        <Text style={styles.linkText}>Register</Text>
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
