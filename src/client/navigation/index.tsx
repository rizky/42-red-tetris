import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import NotFoundScreen from '/client/screens/NotFoundScreen';
import Login from '/client/screens/Login';
import Playground from '/client/screens/Playground';
import LinkingConfiguration from '/client/navigation/LinkingConfiguration';
import io from 'socket.io-client';
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
  const socket: SocketIOClient.Socket = io(`${process.env.SERVER_URL}`);

  const [userContext, setUserContext] = React.useState<{username: undefined | string, room: undefined | string}>({username: undefined, room: undefined});

  const updateUserContext = ({username, room}: {username: string, room: string}) => {
    setUserContext({username, room});
  };

  return (
    <SocketContext.Provider value={socket} >
      <UserContext.Provider value={{userContext, updateUserContext}} >
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Root" component={Login} />
          <Stack.Screen name="Playground" component={Playground} />
          <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
        </Stack.Navigator>
      </UserContext.Provider>
    </SocketContext.Provider>
  );
}
