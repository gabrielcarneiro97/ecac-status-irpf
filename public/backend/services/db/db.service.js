const { Config } = require('./models');

const { db } = require('./connection.service');

async function init() {
  await db().sync();

  const checkStatus = await Config.findByPk('set');

  if (!checkStatus) {
    await Config.createConfigs([
      { nome: 'set', valor: 'OK' },
      { nome: 'threadsMax', valor: '5' },
    ]);
  }

  return true;
}

module.exports = {
  init,
};
