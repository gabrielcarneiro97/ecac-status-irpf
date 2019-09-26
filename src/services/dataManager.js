const fs = require('fs');
const knex = require('knex');
const { readConfig } = require('./configManager');

const { dbPath, dbEmptyPath } = readConfig();

function checkDB() {
  try {
    fs.readFileSync(dbPath);
    return true;
  } catch (error) {
    if (error.errno === -4058) {
      fs.copyFileSync(dbEmptyPath, dbPath);
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

let lite = dbConnect();


function dbClose(db) {
  db.destroy();
}

function clearDB() {
  dbClose(lite);
  fs.copyFileSync(dbEmptyPath, dbPath);
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
  console.log('writeDataFromArrayOfArrays');
  return Promise.all(
    arrays.map(writeDataFromArray),
  );
}

async function clearAndSave(arrays) {
  clearDB();
  console.log('clearAndSave');
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
