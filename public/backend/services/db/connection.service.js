const { Sequelize } = require('sequelize');

const { files } = require('../paths.service');

let seql = null;

function db() {
  if (seql) return seql;

  seql = new Sequelize({
    dialect: 'sqlite',
    storage: files.db(),
  });

  return seql;
}

module.exports = {
  db,
};
