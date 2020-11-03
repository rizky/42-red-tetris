import  React, { useState, useEffect, useContext } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, Text, TouchableOpacity, TextInput, View, Picker } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import SocketContext from '/client/context/SocketContext';
import Gameboy from '/client/components/Gameboy';
import { checkUsername, checkTextLength } from '/client/screens/Login/utils';

const fetchWaitingRooms = async (): Promise<string[] | []> => {
  try {
    const response = await axios.get(`${process.env.SERVER_URL}/rooms/waiting`);
    if (response.data) return response.data;
  } catch(error) {
    console.log(error);
  }
  return [];
};

export default function Login(): JSX.Element {
  const socket = useContext(SocketContext);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Root'>>();
  const [username, setUsername] = useState<string | null>();
  const [room, setRoom] = useState<string | null>();
  const [ussernameError, setUsernameError] = useState<string>('');
  const [roomNameError, setRoomNameError] = useState<string>('');
  const [waitingRooms, setWaitingRooms] = useState<string[]>(['No room']);

  // useEffect(() => {
  //   fetchWaitingRooms().then(data => {
  //     setWaitingRooms(data.length === 0 ? ['No room'] : data);
  //   });
  //   console.log('waitingRooms fetch:', waitingRooms);
  // }, []);

  console.log('Updates for waitingRooms:', waitingRooms);
  useEffect(() => {
    if (!socket) throw Error('No socket');
    // For the moment socket only fetches new rooms on page mount (like http request)
    // if I remove [] from useEffect there is a flood of sockets,
    // for some reason component rerenders several times a second.
    // Later we can listen to a socket event when new room is created (done) + when game in room has started + when room is deleted
    socket.emit('fetch waiting rooms');
    socket.on('all waiting rooms', (roomNames: string[]) => {
      setWaitingRooms(roomNames);
    });
  }, []);
  
  useEffect(() => {
    if (!socket) throw Error('No socket');
    // new room is created
    socket.on('update waiting rooms', (roomNames: string[]) => {
      setWaitingRooms(roomNames);
    });
  });

  const onJoinRoomPress = () => {
    if(!checkTextLength(room)) setRoomNameError('Name must be 1-15 symbols');

    checkUsername(username)
      .then(data => {
        if (data === true)
          username && room && navigation.push('Playground', { username, room });
      })
      .catch(err => {
        setUsernameError(err.message);
      });
  };

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
        <Text style={styles.error}>{roomNameError}</Text>
        <TextInput
          value={room ?? ''}
          onChangeText={text => {
            setRoomNameError('');
            setRoom(text);
          }}
          style={{ borderWidth: 1, marginBottom: 20, height: 30, width: '100%' }}
        />
        {/* TODO: add select button + move to a separate screen */}
        <View style={{ width: '60%' }}>
          <Text style={styles.title}>Select room</Text>
          {waitingRooms.map((roomName) =>
            <View key={roomName}>
              <TouchableOpacity
                style={{ backgroundColor: roomName === room ? 'grey' : 'none', borderWidth: 1, margin: 3, padding: 3, alignItems: 'center' }}
                onPress={() => {
                  setRoom(roomName);
                }}>
                <Text>{roomName}</Text>
              </TouchableOpacity>
            </View>)}
        </View>
        <TouchableOpacity
          style={{ marginBottom: 20 }}
          onPress={onJoinRoomPress}
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
    marginBottom: 5,
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
