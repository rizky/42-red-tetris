import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Navigation from '/navigation';
import io from 'socket.io-client';

// Check socket connection
const socket = io(`${process.env.EXPO_SOCKET_URL}`);

export default function App(): JSX.Element | null {
  return (
    <SafeAreaProvider>
      <Navigation />
      <StatusBar />
    </SafeAreaProvider>
  );
}
