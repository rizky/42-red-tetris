/* eslint-disable no-undef */
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['inline-dotenv',
        {
          path: './.env'
        }
      ],
      [
        'module-resolver',
        {
          alias: {
            '': './src',
            'assets': './assets',
          },
        },
      ],
    ],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
};
