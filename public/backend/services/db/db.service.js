const Config = require('./models/config.model');

const { db } = require('./connection.service');

async function init() {
  await db().sync();

  const checkStatus = await Config.findByPk('set');

  if (!checkStatus) {
    await Config.createConfigs([
      { nome: 'set', valor: 'OK' },
      { nome: 'threadsMax', valor: '10' },
    ]);
  }
}

module.exports = {
  init,
};
