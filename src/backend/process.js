const { ipcRenderer } = require('electron');

const { start } = require('../services/puppeteer');

console.log('teste');

ipcRenderer.on('start', () => {
  console.log('start');
  start();
});
