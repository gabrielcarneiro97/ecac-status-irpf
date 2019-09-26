const fs = require('fs');

const configPath = './src/config/config.json';
const defaultPath = './src/config/default.json';

function checkConfig() {
  try {
    fs.readFileSync(configPath);
    return true;
  } catch (error) {
    if (error.errno === -4058) {
      fs.copyFileSync(defaultPath, configPath);
      return true;
    }
    return false;
  }
}

function readConfig() {
  checkConfig();
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return config;
}

function saveConfig(config) {
  checkConfig();
  const json = JSON.stringify(config);

  return fs.writeFileSync(configPath, json);
}

function changeConfig(name, data) {
  checkConfig();
  const config = readConfig();
  config[name] = data;
  saveConfig(config);

  return readConfig();
}

module.exports = {
  readConfig,
  changeConfig,
};
