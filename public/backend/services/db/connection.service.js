const { Sequelize } = require('sequelize');
const sqlite3 = require('sqlite3');

const { files } = require('../paths.service');

let seql = null;

function db() {
  if (seql) return seql;

  seql = new Sequelize({
    dialect: 'sqlite',
    dialectModule: sqlite3,
    storage: files.db(),
  });

  return seql;
}

module.exports = {
  db,
};
