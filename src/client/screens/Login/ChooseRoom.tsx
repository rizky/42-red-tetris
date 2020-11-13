import  React, { useState, useEffect, useContext, Dispatch, SetStateAction } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, Text, TouchableOpacity, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { SOCKETS } from '/config/constants';
import SocketContext from '/client/context/SocketContext';
import { checkTextLength } from '/client/screens/Login/utils';
import UserContext from '/client/context/UserContext';

type Props = {
	username: string | null | undefined,
	roomName: string | null | undefined,
	setRoomName: Dispatch<SetStateAction<string | null | undefined>>,
};

export default function ChooseRoom(props: Props): JSX.Element {
  const {username, roomName, setRoomName} = props;

  const socket = useContext(SocketContext);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Root'>>();
  const [roomNameError, setRoomNameError] = useState<string>('');
  const [waitingRooms, setWaitingRooms] = useState<string[]>([]);
  const {updateUserContext} = useContext(UserContext);

  console.log('Updates for waitingRooms:', waitingRooms);
  useEffect(() => {
    if (!socket) throw Error('No socket');
    // If I remove [] from useEffect there is a flood of sockets, for some reason component rerenders several times a second.
    // Later we need to listen to a socket event when game in room has started.
    socket.emit(SOCKETS.FETCH_WAITING_ROOMS);
    socket.on(SOCKETS.FETCH_WAITING_ROOMS, (roomNames: string[]) => {
      setWaitingRooms(roomNames);
    });
  }, []);
  
  useEffect(() => {
    if (!socket) throw Error('No socket');
    // new room is created + room is deleted
    socket.on(SOCKETS.UPDATE_WAITING_ROOMS, (roomNames: string[]) => {
      setWaitingRooms(roomNames);
    });
  });

  const onJoinRoomPress = (roomName: string | null | undefined) => {
    if(!checkTextLength(roomName)) setRoomNameError('Name must be 1-15 symbols');
    else {
      updateUserContext({ username, room: roomName });
      username && roomName && navigation.push('Playground', { username, room: roomName });
    }
  };

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <Text style={{ fontSize: 16, marginBottom: 50 }}>Hello, {username}</Text>
      <Text style={styles.title}>Create room</Text>
      <Text style={styles.error}>{roomNameError}</Text>
      <TextInput
        value={roomName ?? ''}
        onChangeText={text => {
          setRoomNameError('');
          setRoomName(text);
        }}
        style={{ borderWidth: 1, marginBottom: 20, height: 30, width: '100%' }}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => onJoinRoomPress(roomName)}
      >
        <Text style={styles.linkText}>Play</Text>
      </TouchableOpacity>
      <View style={{ width: '80%', marginTop: 20 }}>
        {waitingRooms.length > 0 && <Text style={styles.title}>Join room</Text>}
        {waitingRooms.length > 0 && waitingRooms.map((waitingRoom) =>
          <View key={waitingRoom}>
            <TouchableOpacity
              style={styles.roomsList}
              onPress={() => onJoinRoomPress(waitingRoom)}
            >
              <Text>{waitingRoom}</Text>
            </TouchableOpacity>
          </View>)}
      </View>
    </View>
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
  roomsList: {
    borderWidth: 1,
    borderRadius: 5,
    margin: 3,
    padding: 2,
    alignItems:
		'center',
  },
  button: {
    width: '70%',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    padding: 3,
    marginBottom: 10,
  },
});
