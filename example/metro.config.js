// Runs the captions package straight from ../src, so edits there show up without a build.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const root = path.resolve(__dirname, '..');
const config = getDefaultConfig(__dirname);

config.watchFolders = [root];
// One copy of react and react-native: the example's. The repo root has its own dev copies, so
// hide those and let ../src fall through to this app's node_modules.
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];
config.resolver.blockList = [new RegExp(`${root}/node_modules/(react|react-native)/.*`)];

module.exports = config;
