const { ipcRenderer } = require('electron');

const { start } = require('../services/puppeteer');

ipcRenderer.on('start', () => {
  console.log('start');
  start();
});
