const fs = require('fs');
const path = require('path');
const knex = require('knex');

const { readConfig } = require('./configManager');
const { getDocsFolder } = require('./docsFolder');

const { dbEmptyPath } = readConfig();

function paths() {
  const docsFolder = getDocsFolder();

  const fullDbPath = path.join(docsFolder, 'db.db');
  return {
    fullDbPath,
    fullDbEmptyPath: path.join(__dirname, '/..', dbEmptyPath),
  };
}

function checkDB() {
  const { fullDbEmptyPath, fullDbPath } = paths();
  try {
    fs.readFileSync(fullDbPath);
    return true;
  } catch (error) {
    fs.copyFileSync(fullDbEmptyPath, fullDbPath);
    return true;
  }
}

function dbConnect() {
  checkDB();
  const { fullDbPath } = paths();

  return knex({
    client: 'sqlite3',
    connection: {
      filename: fullDbPath,
    },
    useNullAsDefault: true,
  });
}

let lite = dbConnect();


function dbClose(db) {
  db.destroy();
}

function clearDB() {
  dbClose(lite);
  const { fullDbEmptyPath, fullDbPath } = paths();
  fs.copyFileSync(fullDbEmptyPath, fullDbPath);
  lite = dbConnect();
}


async function readData() {
  const data = await lite.select('*').from('tb_dados');

  return data;
}

async function readDataAsArrayOfArrays() {
  const data = await readData();
  return data.map((obj) => Object.values(obj));
}

async function writeData(obj) {
  if (!obj.cpf) return false;

  const data = await lite('tb_dados').select('*').where({ cpf: obj.cpf });

  if (data.length !== 0) {
    await lite('tb_dados').where({ cpf: obj.cpf }).update(obj);
  } else {
    await lite('tb_dados').insert(obj);
  }

  return true;
}

async function writeDataFromArray(array) {
  const data = {
    nome: array[0],
    cpf: array[1],
    codigoAcesso: array[2],
    senha: array[3],
    decStatus: array[4],
  };

  return writeData(data);
}

async function writeDataFromArrayOfArrays(arrays) {
  return Promise.all(
    arrays.map(writeDataFromArray),
  );
}

async function clearAndSave(arrays) {
  clearDB();
  return writeDataFromArrayOfArrays(arrays);
}

module.exports = {
  readData,
  readDataAsArrayOfArrays,
  writeData,
  writeDataFromArray,
  writeDataFromArrayOfArrays,
  clearAndSave,
};
