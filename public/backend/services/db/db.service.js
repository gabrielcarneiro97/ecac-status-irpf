const { homedir } = require('os');
const path = require('path');
const Config = require('./models/config.model');

const { db } = require('./connection.service');

async function init() {
  await db().sync();

  const checkStatus = await Config.findByPk('set');

  if (!checkStatus) {
    await Config.createConfigs([
      { nome: 'set', valor: 'OK' },
      { nome: 'threadsMax', valor: '10' },
      { nome: 'anoConsulta', valor: '2020' },
      { nome: 'folder', valor: path.join(homedir(), 'Documents', 'IRPF-Extratos') },
    ]);
  }
}

module.exports = {
  init,
};
