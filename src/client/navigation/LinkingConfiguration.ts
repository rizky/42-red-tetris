import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: '/',
      Playground: '/play',
      Ranking: '/ranking',
      NotFound: '*',
    },
  },
};
