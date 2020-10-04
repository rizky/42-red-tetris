import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, Text, TouchableOpacity, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';

import Gameboy from '/client/components/Gameboy';

export default function Login(): JSX.Element {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Root'>>();
  const [username, setUsername] = React.useState<string | null>();
  const [room, setRoom] = React.useState<string | null>();
  return (
    <Gameboy>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.title}>{'Username'}</Text>
        <TextInput
          value={username ?? ''}
          onChangeText={setUsername}
          style={{ borderWidth: 1, marginBottom: 20, height: 30 }}
        />
        <Text style={styles.title}>{'Room'}</Text>
        <TextInput
          value={room ?? ''}
          onChangeText={setRoom}
          style={{ borderWidth: 1, marginBottom: 20, height: 30 }}
        />
        <TouchableOpacity
          style={{ marginBottom: 20 }}
          onPress={() => username && room && navigation.push('Playground', { username, room })}
        >
          <Text style={styles.linkText}>Join Room</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.push('Playground', {})}
        >
          <Text style={styles.linkText}>Solo mode</Text>
        </TouchableOpacity>
      </View>
    </Gameboy>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  linkText: {
    fontSize: 14,
    color: '#004580',
  },
});
