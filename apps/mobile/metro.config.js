const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Intercept resolve request to mock ReactDevToolsSettingsManager for web build
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.includes('ReactDevToolsSettingsManager') && platform === 'web') {
    return {
      filePath: path.resolve(__dirname, './mocks/ReactDevToolsSettingsManagerMock.js'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
