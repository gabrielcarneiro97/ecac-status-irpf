const path = require('path');
const fs = require('fs');
const { homedir } = require('os');

const hidefile = require('hidefile');

function getDocsFolder() {
  const docsFolder = path.join(homedir(), 'Documents', '.acessaEcac');

  if (!fs.existsSync(docsFolder)) {
    fs.mkdirSync(docsFolder);
    hidefile.hideSync(docsFolder);
  }

  return docsFolder;
}

module.exports = {
  getDocsFolder,
};
