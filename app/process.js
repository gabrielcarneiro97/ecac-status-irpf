const { ipcRenderer } = require('electron');

const { start } = require('./puppeteer');

ipcRenderer.on('start', () => {
  console.log('start');
  start();
});
