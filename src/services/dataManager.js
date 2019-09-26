const fs = require('fs');
const knex = require('knex');
const { readConfig } = require('./configManager');

const { dbPath, dbEmptyPath } = readConfig();

function clearDB() {
  fs.copyFileSync(dbEmptyPath, dbPath);
}

function checkDB() {
  try {
    fs.readFileSync(dbPath);
    return true;
  } catch (error) {
    if (error.errno === -4058) {
      clearDB();
      return true;
    }
    return false;
  }
}

function dbConnect() {
  checkDB();

  return knex({
    client: 'sqlite3',
    connection: {
      filename: dbPath,
    },
    useNullAsDefault: true,
  });
}

function dbClose(db) {
  db.destroy();
}

async function readData() {
  const lite = dbConnect();
  const data = await lite.select('*').from('tb_dados');
  dbClose(lite);

  return data;
}

async function readDataAsArrayOfArrays() {
  const data = await readData();
  return data.map((obj) => Object.values(obj));
}

async function writeData(obj) {
  if (!obj.cpf) return false;

  const lite = dbConnect();
  const data = await lite('tb_dados').select('*').where({ cpf: obj.cpf });

  if (data.length !== 0) {
    await lite('tb_dados').where({ cpf: obj.cpf }).update(obj);
  } else {
    await lite('tb_dados').insert(obj);
  }

  dbClose(lite);

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
