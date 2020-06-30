const { ipcRenderer } = require('electron');

const { rfbAccessTime, loadChromium } = require('./services/puppeteer');
const { readDataAsArrayOfArrays, clearAndSave } = require('./services/dataManager');
const Config = require('./services/db/models/config.model');

loadChromium();

ipcRenderer.on('readData', async () => {
  const data = await readDataAsArrayOfArrays();
  ipcRenderer.send('dbData', { data, dataLength: data.length });
});

ipcRenderer.on('saveData', async (e, { data }) => {
  await clearAndSave(data);
  ipcRenderer.send('saveEnd');
});

ipcRenderer.on('startCheck', async (e, { savePDF, anoConsulta }) => {
  ipcRenderer.send('checkEnd');
});

ipcRenderer.on('accessTime', async () => {
  const time = await rfbAccessTime();

  ipcRenderer.send('timeReturn', { time });
});

ipcRenderer.on('getConfig', async () => {
  ipcRenderer.send('configReturn', { config: await Config.all() });
});
