import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: '/',
      Playground: '/play',
      TestSockets: '/sockets',
      NotFound: '*',
    },
  },
};
