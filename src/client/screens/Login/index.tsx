import  React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import io from 'socket.io-client';

import ChooseUsername from '/client/screens/Login/ChooseUsername';
import ChooseRoom from '/client/screens/Login/ChooseRoom';
import Gameboy from '/client/components/Gameboy';
import SocketContext from '/client/context/SocketContext';

export default function Login(): JSX.Element {
  const [screenNumber, setScreenNumber] = useState<1 | 2>(1);

  const { socketContext: socket, setSocketContext } = useContext(SocketContext);

  useEffect(() => {
    if (socket) socket.disconnect();
    setSocketContext(io(`${process.env.EXPO_SERVER_URL}`));
  }, []);

  return (
    <Gameboy>
      <View style={{ alignItems: 'center', width: '60%' }}>
        {screenNumber === 1
          ? <ChooseUsername setScreenNumber={setScreenNumber} />
          : <ChooseRoom setScreenNumber={setScreenNumber} />
        }
      </View>
    </Gameboy>
  );
}

export const styles = StyleSheet.create({
  title: {
    marginTop: 30,
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
  input: {
    borderWidth: 1,
    marginBottom: 20,
    height: 30,
    width: '90%',
  },
});
