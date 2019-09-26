const fs = require('fs');

const configPath = './src/config/config.json';

function readConfig() {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return config;
}

function saveConfig(config) {
  const json = JSON.stringify(config);

  return fs.writeFileSync(configPath, json);
}

function changeConfig(name, data) {
  const config = readConfig();
  config[name] = data;
  saveConfig(config);

  return readConfig();
}

module.exports = {
  readConfig,
  changeConfig,
};
