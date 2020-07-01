const path = require('path');
const fs = require('fs');
const { homedir } = require('os');

const hidefile = require('hidefile');

// PASTAS

function main() {
  const docsFolder = path.join(homedir(), '.acessaEcac');

  if (!fs.existsSync(docsFolder)) {
    fs.mkdirSync(docsFolder);
    hidefile.hideSync(docsFolder);
  }

  return docsFolder;
}

function extratos() {
  const extratosFolder = path.join(homedir(), 'Documents', 'IRPF-Extratos');

  if (!fs.existsSync(extratosFolder)) {
    fs.mkdirSync(extratosFolder);
  }

  return extratosFolder;
}

// FIM PASTAS

// ARQUIVOS

function db() {
  return path.join(main(), 'seql-db.db');
}

// FIM ARQUIVOS

module.exports = {
  folders: {
    main,
    extratos,
  },
  files: {
    db,
  },
};
