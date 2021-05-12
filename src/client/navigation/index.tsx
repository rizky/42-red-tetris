import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState } from 'react';
import { ColorSchemeName } from 'react-native';

import NotFoundScreen from '/client/screens/NotFoundScreen';
import Login from '/client/screens/Login';
import Playground from '/client/screens/Playground';
import Ranking from '/client/screens/Ranking';
import LinkingConfiguration from '/client/navigation/LinkingConfiguration';
import SocketContext from '/client/context/SocketContext';
import UserContext from '/client/context/UserContext';

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme?: ColorSchemeName }): JSX.Element {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const [socketContext, setSocketContext] = useState<undefined | SocketIOClient.Socket>(undefined);

  // const getSocket = (): SocketIOClient.Socket => {
  //   if (socketContext) {
  //     return socketContext;
  //   }
  //   const newSocket = io(`${process.env.EXPO_SERVER_URL}`);
  //   setSocketContext(newSocket);
  //   return newSocket;
  // };
  
  const [userContext, setUserContext] = useState<UserContextType>({username: undefined, room: undefined});

  return (
    <SocketContext.Provider value={{ socketContext, setSocketContext }}>
      <UserContext.Provider value={{ userContext, setUserContext }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Login} />
          <Stack.Screen name="Playground" component={Playground} />
          <Stack.Screen name="Ranking" component={Ranking} />
          <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
        </Stack.Navigator>
      </UserContext.Provider>
    </SocketContext.Provider>
  );
}
