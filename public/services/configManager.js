const fs = require('fs');
const path = require('path');

function paths() {
  return {
    configPath: path.join(__dirname, '../config/config.json'),
    defaultPath: path.join(__dirname, '../config/default.json'),
  };
}

function checkConfig() {
  const { configPath, defaultPath } = paths();
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
  const { configPath } = paths();
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return config;
}

function saveConfig(config) {
  checkConfig();
  const { configPath } = paths();
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
