const path = require('path');
const { Sequelize } = require('sequelize');

const { getDocsFolder } = require('../docsFolder');

let seql = null;

function dbPath() {
  const folder = getDocsFolder();
  const fileName = 'seql-db.db';
  const filePath = path.join(folder, fileName);

  return filePath;
}

function db() {
  if (seql) return seql;

  seql = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath(),
  });

  return seql;
}

module.exports = {
  db,
};
