const { ipcRenderer } = require('electron');

const { start, rfbAccessTime } = require('../services/puppeteer');

const { readDataAsArrayOfArrays, clearAndSave } = require('../services/dataManager');

ipcRenderer.on('readData', async () => {
  const data = await readDataAsArrayOfArrays();
  console.log(data);
  ipcRenderer.send('dbData', { data, dataLength: data.length });
});

ipcRenderer.on('saveData', async (e, { data }) => {
  await clearAndSave(data);
  ipcRenderer.send('saveEnd');
});

ipcRenderer.on('startCheck', async () => {
  await start();
  ipcRenderer.send('checkEnd');
});

ipcRenderer.on('accessTime', async () => {
  const time = await rfbAccessTime();

  ipcRenderer.send('timeReturn', { time });
});
