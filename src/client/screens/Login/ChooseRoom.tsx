import  React, { useState, useEffect, useContext, Dispatch, SetStateAction } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, Text, TouchableOpacity, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { SOCKETS } from '/config/constants';
import { checkRoomName, isRoomPlayersLimitAvailable } from '/client/screens/Login/utils';
import SocketContext from '/client/context/SocketContext';
import UserContext from '/client/context/UserContext';

type Props = {
  setScreenNumber: Dispatch<SetStateAction<1 | 2>>,
};

export default function ChooseRoom(props: Props): JSX.Element {
  const {setScreenNumber} = props;
  const { userContext, setUserContext } = useContext(UserContext);
  const { username, room: roomName } = userContext;
  const socket = useContext(SocketContext);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Root'>>();
  const [roomNameError, setRoomNameError] = useState<string>('');
  const [joinRoomError, setJoinRoomError] = useState<string>('');
  const [waitingRooms, setWaitingRooms] = useState<string[]>([]);

  console.log('Updates for waitingRooms:', waitingRooms);

  const handleFetchWaitingRooms = (roomNames: string[]) => setWaitingRooms(roomNames);

  const handleUpdateWaitingRooms = (roomNames: string[]) => {
    setRoomNameError('');
    setJoinRoomError('');
    return setWaitingRooms(roomNames);
  };

  useEffect(() => {
    if (!socket) throw Error('No socket');
    // If I remove [] from useEffect there is a flood of sockets, for some reason component rerenders several times a second.
    socket.emit(SOCKETS.FETCH_WAITING_ROOMS);

    // Get waitingRooms when enter ChooseUsername screen
    socket.on(SOCKETS.FETCH_WAITING_ROOMS, handleFetchWaitingRooms);

    // Get waitingRooms when other users create / delete rooms and ChooseUsername screen is already open
    socket.on(SOCKETS.UPDATE_WAITING_ROOMS, handleUpdateWaitingRooms);
  
    return () => {
      socket.removeListener(SOCKETS.FETCH_WAITING_ROOMS, handleFetchWaitingRooms);
      socket.removeListener(SOCKETS.UPDATE_WAITING_ROOMS, handleUpdateWaitingRooms);
    };
  }, []);

  const onCreateRoomPress = (roomName: string | undefined) => {
    checkRoomName(roomName)
      .then(data => {
        if (data === true) {
          if(!socket) throw Error('No socket');
          socket.emit(SOCKETS.CHOOSE_ROOM, { username, roomName });
          username && roomName && navigation.push('Playground', { username, room: roomName });
          setScreenNumber(1);
        }
      })
      .catch(err => {
        setJoinRoomError('');
        setRoomNameError(err.message);
      });
  };

  const onJoinRoomPress = (roomName: string | null | undefined) => {
    setRoomNameError('');
    setJoinRoomError('');
    isRoomPlayersLimitAvailable(roomName)
      .then(data => {
        if (data === true) {
          setUserContext({ username, room: roomName });
          if (!socket) throw Error('No socket');
          socket.emit(SOCKETS.CHOOSE_ROOM, { username, roomName });
          username && roomName && navigation.push('Playground', { username, room: roomName });
          setScreenNumber(1);
        }
      })
      .catch(err => {
        setRoomNameError('');
        setJoinRoomError(err.message);
      });
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
          setJoinRoomError('');
          setUserContext({username, room: text});
        }}
        style={{ borderWidth: 1, marginBottom: 20, height: 30, width: '100%' }}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => onCreateRoomPress(roomName)}
      >
        <Text style={styles.linkText}>Play</Text>
      </TouchableOpacity>
      <View style={{ width: '90%', marginTop: 20 }}>
        {waitingRooms.length > 0 && <Text style={styles.title}>Join room</Text>}
        <Text style={styles.error}>{joinRoomError}</Text>
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
