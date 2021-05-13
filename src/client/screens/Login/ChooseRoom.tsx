import  React, { useState, useEffect, useContext, Dispatch, SetStateAction } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text, TouchableOpacity, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { SOCKETS } from '/config/constants';
import { checkRoomName, isRoomPlayersLimitAvailable, composeSoloRoomName } from '/client/screens/Login/utils';
import SocketContext from '/client/context/SocketContext';
import UserContext from '/client/context/UserContext';
import { styles } from '/client/screens/Login';

type Props = {
  setScreenNumber: Dispatch<SetStateAction<1 | 2>>,
};

export default function ChooseRoom(props: Props): JSX.Element {
  const {setScreenNumber} = props;
  const { userContext, setUserContext } = useContext(UserContext);
  const { username, room: roomName } = userContext;
  const { socketContext: socket } = useContext(SocketContext);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();
  const [roomNameError, setRoomNameError] = useState<string>('');
  const [joinRoomError, setJoinRoomError] = useState<string>('');
  const [waitingRooms, setWaitingRooms] = useState<string[]>([]);

  if (!username) setScreenNumber(1);

  // console.log('Updates for waitingRooms:', waitingRooms);

  const handleFetchWaitingRooms = (roomNames: string[]) => setWaitingRooms(roomNames);

  const handleUpdateWaitingRooms = (roomNames: string[]) => {
    setRoomNameError('');
    setJoinRoomError('');
    return setWaitingRooms(roomNames);
  };

  const socketEmitChooseOrCreateRoom = (roomName: string  | null | undefined) => {
    if(!socket) throw Error('No socket');
    socket.emit(SOCKETS.CHOOSE_ROOM, { username, roomName });
    username && roomName && navigation.push('Playground', { username, room: roomName });
  };

  useEffect(() => {
    if (!socket) return navigation.replace('Home');
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
          socketEmitChooseOrCreateRoom(roomName);
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
          socketEmitChooseOrCreateRoom(roomName);
          setScreenNumber(1);
        }
      })
      .catch(err => {
        setRoomNameError('');
        setJoinRoomError(err.message);
      });
  };

  const onSoloModePress = () => {
    setRoomNameError('');
    setJoinRoomError('');
    setUserContext({ username, room: composeSoloRoomName(username) });
    socketEmitChooseOrCreateRoom(composeSoloRoomName(username));
  };

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => onSoloModePress()}
      >
        <Text style={styles.linkText}>Play solo</Text>
      </TouchableOpacity>
      <View style={{width: '90%'}}>
        <Text style={styles.title}>Room name</Text>
        <Text style={styles.error}>{roomNameError}</Text>
      </View>
      <TextInput
        value={roomName ?? ''}
        onChangeText={text => {
          setRoomNameError('');
          setJoinRoomError('');
          setUserContext({username, room: text});
        }}
        style={styles.input}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => onCreateRoomPress(roomName)}
      >
        <Text style={styles.linkText}>Create</Text>
      </TouchableOpacity>
      <View style={{ width: '90%' }}>
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

