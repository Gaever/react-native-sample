module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'babel-plugin-styled-components',
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '~graphql': './src/graphql',
          '~components': './src/components',
          '~validations': './src/validations',
          '~constants': './src/constants',
          '~themes': './src/themes',
          '~store': './src/store',
          '~reducers': './src/store/reducers',
          '~views': './src/views',
          '~services': './src/services',
          '~assets': './src/assets',
          '~images': './src/assets/images',
          '~animations': './src/assets/animations',
          '~config': './src/config',
          '~src': './src',
        },
      },
    ],
  ],
};
