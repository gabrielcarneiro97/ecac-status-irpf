const { ipcRenderer } = require('electron');

const { rfbAccessTime, loadChromium } = require('./services/puppeteer');
const Config = require('./services/db/models/config.model');

loadChromium();

ipcRenderer.on('accessTime', async () => {
  const time = await rfbAccessTime();

  ipcRenderer.send('timeReturn', { time });
});

ipcRenderer.on('getConfig', async () => {
  ipcRenderer.send('configReturn', { config: await Config.all() });
});
