import  React, { useState, useContext, Dispatch, SetStateAction } from 'react';
import { Text, TouchableOpacity, TextInput, View } from 'react-native';

import { SOCKETS } from '/config/constants';
import { checkUsername } from '/client/screens/Login/utils';
import SocketContext from '/client/context/SocketContext';
import UserContext from '/client/context/UserContext';
import { styles } from '/client/screens/Login';

type Props = {
	setScreenNumber: Dispatch<SetStateAction<1 | 2>>,
};

export default function ChooseUsername(props: Props): JSX.Element {
  const {setScreenNumber} = props;
  const { userContext, setUserContext } = useContext(UserContext);
  const { username } = userContext;
  const { socketContext: socket } = useContext(SocketContext);
  const [ussernameError, setUsernameError] = useState<string>('');

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
      <View style={{width: '90%'}}>
        <Text style={styles.title}>{'Username'}</Text>
        <Text style={styles.error}>{ussernameError}</Text>
      </View>
      <TextInput
        value={username ?? ''}
        onChangeText={text => {
          setUsernameError('');
          setUserContext({username: text, room: undefined});
        }}
        style={styles.input}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={validateUsername}
      >
        <Text style={styles.linkText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
