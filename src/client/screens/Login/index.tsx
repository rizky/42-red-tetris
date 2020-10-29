import  React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, Text, TouchableOpacity, TextInput, View, Picker } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';

import Gameboy from '/client/components/Gameboy';
import { checkUsername } from '/client/screens/Login/utils';

// const fetchWaitingRooms = async (): Promise<string[] | []> => {
//   try {
//     const response = await axios.get(`${process.env.SERVER_URL}/rooms/waiting`);
//     if (response.data) return response.data;
//   } catch(error) {
//     console.log(error);
//   }
//   return [];
// };

export default function Login(): JSX.Element {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Root'>>();
  const [username, setUsername] = useState<string | null>();
  const [room, setRoom] = useState<string | null>();

  const [ussernameError, setUsernameError] = useState<string>('');
  const [waitingRooms, setWaitingRooms] = useState<string[]>(['No room']);

  // useEffect(() => {
  //   fetchWaitingRooms().then(data => {
  //     setWaitingRooms(['No room', ...data]);
  //   });
  // }, []);

  console.log('waitingRooms:', waitingRooms);
  const [selectedRoom, setSelectedRoom] = useState<string | null>();


  return (
    <Gameboy>
      <View style={{ alignItems: 'center', width: '60%' }}>
        <Text style={styles.title}>{'Username'}</Text>
        <Text style={styles.error}>{ussernameError}</Text>
        <TextInput
          value={username ?? ''}
          onChangeText={text => {
            setUsernameError('');
            setUsername(text);
          }}
          style={{ borderWidth: 1, marginBottom: 20, height: 30, width: '100%' }}
        />
        <Text style={styles.title}>{'Room'}</Text>
        <TextInput
          value={room ?? ''}
          onChangeText={setRoom}
          style={{ borderWidth: 1, marginBottom: 20, height: 30, width: '100%' }}
        />
        <Picker
          selectedValue={selectedRoom}
          onValueChange={(itemValue) => setSelectedRoom(itemValue)}
          style={{ borderWidth: 1, marginBottom: 20, height: 30, width: '100%' }}
        >
          {waitingRooms.map((room: string) => <Picker.Item key={room} label={room} value={room}></Picker.Item>)}
        </Picker>
        <TouchableOpacity
          style={{ marginBottom: 20 }}
          onPress={() => {
            checkUsername(username)
              .then(data => {
                if (data === true)
                  username && room && navigation.push('Playground', { username, room });
              })
              .catch(err => {
                setUsernameError(err.message);
              });
          }}
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
    textAlign: 'center',
  },
  error: {
    marginBottom: 5,
    alignSelf: 'flex-start',
    textAlign: 'center',
    color: '#980f0f',
  },
  linkText: {
    fontSize: 14,
  },
});
