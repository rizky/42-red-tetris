import * as Linking from 'expo-linking';
/*
** Without makeUrl with process.env.PUBLIC_URL github pages doesn't see links and always goes to not found screen.
** But with it routing doesn't work as expected in dev mode with http://localhost:19006,
** so I check if githubPublicUrl exists and depending on it do routing.
** For sake of deployment don't change name "process.env.PUBLIC_URL"
*/

const githubPublicUrl = process.env.PUBLIC_URL;

const makeGitPagesURL = (path: string) => `${githubPublicUrl ?? ''}${path}`;

export default {
  prefixes: [githubPublicUrl ? Linking.makeUrl(process.env.PUBLIC_URL) : Linking.makeUrl('/')],
  config: {
    screens: {
      Root: makeGitPagesURL('/'),
      Playground: makeGitPagesURL('/play'),
      Ranking: makeGitPagesURL('/ranking'),
      NotFound: '*',
    },
  },
};
