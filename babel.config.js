module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'nativewind/babel',
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@Action': './src/actions',
          '@Asset': './src/assets',
          '@Component': './src/components',
          '@Config': './src/config',
          '@Constant': './src/constants',
          '@Helper': './src/helpers',
          '@Hook': './src/hooks',
          '@Navigator': './src/navigator',
          '@Screen': './src/screens',
          '@Service': './src/services',
          '@Store': './src/store/index.ts',
          '@Reducer': './src/store/reducers',
          '@Type': './src/types',
        }
      }
    ],
    'react-native-reanimated/plugin'
  ]
};
