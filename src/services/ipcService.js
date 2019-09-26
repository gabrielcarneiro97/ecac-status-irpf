const { ipcRenderer } = require('electron');

async function callEnd(pessoa) {
  return new Promise((resolve) => {
    ipcRenderer.send('pessoaEnd', { data: pessoa });
    resolve(pessoa);
  });
}

module.exports = {
  callEnd,
};
