import  React, { useState, useContext, Dispatch, SetStateAction, useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, Text, TouchableOpacity, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import io from 'socket.io-client';

import { SOCKETS } from '/config/constants';
import { checkUsername } from '/client/screens/Login/utils';
import SocketContext from '/client/context/SocketContext';
import UserContext from '/client/context/UserContext';

type Props = {
	setScreenNumber: Dispatch<SetStateAction<1 | 2>>,
};

export default function ChooseUsername(props: Props): JSX.Element {
  const {setScreenNumber} = props;
  const { userContext, setUserContext } = useContext(UserContext);
  const { username } = userContext;
  const { socketContext: socket, setSocketContext } = useContext(SocketContext);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Root'>>();
  const [ussernameError, setUsernameError] = useState<string>('');

  useEffect(() => {
    setSocketContext(io(`${process.env.SERVER_URL}`));
  }, []);
  console.log('Sssssssocket', socket);

  const validateUsername = () => {
    checkUsername(username)
      .then(data => {
        if (data === true) {
          if(!socket) throw Error('No socket');
          socket.emit(SOCKETS.CREATE_USER, username);
          setScreenNumber(2);
        }
      })
      .catch(err => {
        setUsernameError(err.message);
      });
  };

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <Text style={styles.title}>{'Username'}</Text>
      <Text style={styles.error}>{ussernameError}</Text>
      <TextInput
        value={username ?? ''}
        onChangeText={text => {
          setUsernameError('');
          setUserContext({username: text, room: undefined});
        }}
        style={{ borderWidth: 1, marginBottom: 20, height: 30, width: '100%' }}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={validateUsername}
      >
        <Text style={styles.linkText}>Next</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.push('Playground', {})} // TODO: do we need to validate username here too?
      >
        <Text style={styles.linkText}>Solo mode</Text>
      </TouchableOpacity>
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
  button: {
    width: '70%',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    padding: 3,
    marginBottom: 30,
  },
});
