import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Navigation from './src/client/navigation';
import './web/index.css';

export default function App(): JSX.Element | null {
  // Prevent window from scrolling on Space button click
  window.addEventListener('keydown', function(e) {
    if(e.keyCode === 32 && e.target == document.body) {
      e.preventDefault();
    }
  });

  return (
    <SafeAreaProvider>
      <Navigation />
      <StatusBar />
    </SafeAreaProvider>
  );
}
