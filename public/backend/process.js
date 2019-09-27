const { ipcRenderer } = require('electron');
const { homedir } = require('os');
const path = require('path');

const { start, rfbAccessTime, loadChromium } = require('../services/puppeteer');
const { readDataAsArrayOfArrays, clearAndSave } = require('../services/dataManager');
const { readConfig, changeConfig } = require('../services/configManager');

const { folder } = readConfig();

if (folder === '') changeConfig('folder', path.join(homedir(), 'Documents', 'IRPF-Extratos'));

loadChromium();

ipcRenderer.on('readData', async () => {
  const data = await readDataAsArrayOfArrays();
  ipcRenderer.send('dbData', { data, dataLength: data.length });
});

ipcRenderer.on('saveData', async (e, { data }) => {
  await clearAndSave(data);
  ipcRenderer.send('saveEnd');
});

ipcRenderer.on('startCheck', async (e, { savePDF }) => {
  await start(savePDF);
  ipcRenderer.send('checkEnd');
});

ipcRenderer.on('accessTime', async () => {
  const time = await rfbAccessTime();

  ipcRenderer.send('timeReturn', { time });
});

ipcRenderer.on('getConfig', () => {
  ipcRenderer.send('configReturn', { config: readConfig() });
});
