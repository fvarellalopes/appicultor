module.exports = function (api) {
  api.cache(true)
  const plugins = []

  // Configuração do plugin tamagui
  plugins.push([
    '@tamagui/babel-plugin',
    {
      components: ['tamagui'],
      config: './tamagui.config.ts',
    },
  ])

  // Configuração do plugin react-native-dotenv
  plugins.push([
    'module:react-native-dotenv',
    {
      envName: 'APP_ENV',
      moduleName: '@env',
      path: '.env',
    },
  ])

  return {
    presets: ['babel-preset-expo'],
    plugins,
  }
}
